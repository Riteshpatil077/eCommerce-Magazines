"use client";

export default function UserNavbar() {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">User Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, User
        </span>

        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </div>
  );
}