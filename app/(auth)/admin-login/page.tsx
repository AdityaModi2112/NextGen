"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [clubName, setClubName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const validCredentials = {
    "Club A": "passwordA",
    "Club B": "passwordB",
    "Club C": "passwordC",
    "Club D": "passwordD",
    "Club E": "passwordE",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with actual email and password validation

    if (validCredentials[clubName] === password) {
        sessionStorage.setItem("clubName", clubName); // Store clubName in sessionStorage
        router.push("/admin-dashboard"); // Redirect to the dashboard
      } else {
        setError("Invalid club name or password");
      }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="clubName" className="block text-gray-700">
              Club Name
            </label>
            <input
              id="clubName"
              type="text"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter club name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}