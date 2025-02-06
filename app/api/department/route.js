import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const clubName = searchParams.get("club_name");

    // Validate inputs
    if (!department || !clubName) {
      return new Response(
        JSON.stringify({ error: "Missing department or club name" }),
        { status: 400 }
      );
    }

    // Fetch clubId from the ClubEmail table
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

    // Fetch department data with summarized feedback
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
    // Summarize feedback into ~5-6 lines
    const formattedData = result.rows.map((item) => {
      console.log("Row Data:", row); // Log entire row to check missing values
      console.log("Feedback Value:", row.feedback); // Check if feedback is undefined
      const words = item.allFeedback.split(" ");
      const summarizedFeedback =
        words.length > 50 ? words.slice(0, 50).join(" ") + "..." : item.allFeedback;

      return { ...item, feedback: summarizedFeedback };
    });

    return new Response(JSON.stringify(formattedData), { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
