"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface DepartmentData {
  userEmail: string;
  clubName: string;
  department: string;
  rating: string;
  feedback: string;
  techStack: string; // Add techStack property
}

const DepartmentPage = () => {
  const { department } = useParams();
  const [data, setData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clubName, setClubName] = useState<string>("");

  useEffect(() => {
    const storedClubName = sessionStorage.getItem("clubName");
    if (storedClubName) {
      setClubName(storedClubName);
    }
  }, []);

  useEffect(() => {
    if (department && clubName) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `/api/department?department=${department}&club_name=${clubName}`
          );
          if (response.ok) {
            const result = await response.json();
  
            // Debugging: Log the fetched data
            console.log("Fetched data:", result);
  
            const formattedData = result.map((item: any) => {
              let techStackArray: string[] = [];
              try {
                // Remove braces { } and split by comma
                techStackArray = item.techstack.replace(/[{}"]/g, "").split(",");
              } catch (error) {
                console.error("Error parsing techstack:", error, item.techstack);
                techStackArray = [item.techstack]; // Fallback to raw string
              }
  
              return { ...item, techStack: techStackArray.join(", ") };
            });
  
            console.log("Formatted data:", formattedData); // Debugging log
  
            setData(formattedData);
          } else {
            console.error("Error fetching data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }
  }, [department, clubName]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-700">
        Department: {department ? decodeURIComponent(department) : "Unknown"}
      </h1>
      <h2 className="text-xl text-center mb-6 text-blue-500">
        Club: {clubName}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
  <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
    <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold w-10">
      Serial No.
    </th>
    <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold w-40">
      User Email
    </th>
    <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold w-10">
      Rating
    </th>
    <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold w-96">
      Feedback
    </th>
    <th className="text-left px-4 py-3 border-b border-gray-300 text-sm font-semibold w-44">
      Tech Stack
    </th>
  </tr>
</thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                } hover:bg-blue-200`}
              >
                <td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">
  {index + 1}
</td>
<td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">
  {item.userEmail}
</td>
<td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300">
  {item.rating}
</td>
<td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300 whitespace-normal w-96">
  {item.feedback}
</td>
<td className="px-4 py-4 text-sm text-gray-700 border-b border-gray-300 w-44">
  {item.techStack} {/* Now displays like "React, Tailwind, Next.js" */}
</td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentPage;
