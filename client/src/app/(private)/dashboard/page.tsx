// app/dashboard/page.tsx
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Users</span>
          <span className="text-4xl font-bold mt-2">--</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Roles</span>
          <span className="text-4xl font-bold mt-2">--</span>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-xl font-semibold">Permissions</span>
          <span className="text-4xl font-bold mt-2">--</span>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-gray-500">No data available yet.</div>
      </div>
    </div>
  );
};

export default Dashboard;