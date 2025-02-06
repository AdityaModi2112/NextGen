import { Pool } from "pg";
import { GoogleGenerativeAI } from "@google/generative-ai";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const clubName = searchParams.get("club_name");

    if (!department || !clubName) {
      return new Response(
        JSON.stringify({ error: "Missing department or club name" }),
        { status: 400 }
      );
    }

    const clubResult = await pool.query(
      `SELECT id FROM "ClubEmail" WHERE "clubName" = $1`,
      [clubName]
    );

    if (clubResult.rowCount === 0) {
      return new Response(JSON.stringify({ error: "Club not found" }), {
        status: 404,
      });
    }

    const clubId = clubResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT ua."userEmail", ce."clubName", mi."jobPosition" AS department, 
             ua."rating",
             mi."jobDesc" AS techStack,
             STRING_AGG(ua."feedback", ' ') AS allFeedback
      FROM "UserAnswer" ua
      JOIN "MockInterview" mi ON ua."mockIdRef" = mi."mockId"
      JOIN "ClubEmail" ce ON mi."clubId" = ce."id"
      WHERE ce."id" = $1 AND mi."jobPosition" = $2
      GROUP BY ua."userEmail", ce."clubName", mi."jobPosition", mi."jobDesc", ua."rating"
      ORDER BY ua."rating" DESC;
      `,
      [clubId, department]
    );

    const formattedData = await Promise.all(
      result.rows.map(async (item) => {
        const feedbackText =
          item.allfeedback && item.allfeedback.trim() !== ""
            ? item.allfeedback
            : "No feedback provided";

        // Use Gemini to summarize feedback
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const gptResponse = await model.generateContent(
          `Summarize the feedback in 5-6 lines in paragraph dont write in points, keeping all key insights from the given responses but it should be clear what you want to explain: I need feedback only on the required domain.dont give error which are not out of syllabus.be concise dont give like feedback: .. directly start.I want from feeback what user know and lack are written clearly and easy to read \n${feedbackText}`
        );

        const summarizedFeedback = gptResponse.response.text() || "Summary unavailable.";

        return { ...item, feedback: summarizedFeedback };
      })
    );

    return new Response(JSON.stringify(formattedData), { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
