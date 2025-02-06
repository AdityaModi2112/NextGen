"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const departments = ["Frontend Developer", "Events Manager", "Backend Developer", "Management Member", "Competitive Coder","Python Devleoper","Java Developer"];

  const [clubName, setClubName] = useState("");

  useEffect(() => {
    const storedClubName = sessionStorage.getItem("clubName");
    if (storedClubName) {
      setClubName(storedClubName);
    }
  }, []);

  return (
    <section className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-xl mb-4">Club: {clubName || "Unknown"}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {departments.map((department) => (
          <Link
            href={`/admin-dashboard/${department}`}
            key={department}
          >
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer text-center">
              <h2 className="text-xl font-semibold">{department}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
