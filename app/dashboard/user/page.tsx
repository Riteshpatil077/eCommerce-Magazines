// import DashboardCard from "@/app/components/user/DashboardCard";

// export default function UserDashboard() {
//   return (
//     <div className="space-y-6">

//       <h2 className="text-2xl font-bold">Overview</h2>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <DashboardCard title="Active Subscriptions" value="3" />
//         <DashboardCard title="Total Magazines" value="12" />
//         <DashboardCard title="Renewal Date" value="15 Mar 2026" />
//       </div>

//       {/* Recent Subscriptions */}
//       <div className="bg-white shadow rounded-xl p-6">
//         <h3 className="text-lg font-semibold mb-4">
//           Recent Subscriptions
//         </h3>

//         <table className="w-full text-left">
//           <thead>
//             <tr className="border-b">
//               <th className="py-2">Magazine</th>
//               <th>Status</th>
//               <th>Expiry</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="border-b">
//               <td className="py-2">Tech Monthly</td>
//               <td className="text-green-600">Active</td>
//               <td>15 Mar 2026</td>
//             </tr>
//             <tr>
//               <td className="py-2">Design Weekly</td>
//               <td className="text-yellow-600">Expiring Soon</td>
//               <td>10 Mar 2026</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }


import DashboardCard from "@/app/components/user/DashboardCard";

export default function UserDashboard() {
  return (
    <div className="space-y-6">

      <h2 className="text-2xl font-bold">Overview</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Active Subscriptions" value="3" />
        <DashboardCard title="Total Magazines" value="12" />
        <DashboardCard title="Renewal Date" value="15 Mar 2026" />
      </div>

      {/* Recent Subscriptions */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">
          Recent Subscriptions
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Magazine</th>
              <th>Status</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Tech Monthly</td>
              <td className="text-green-600">Active</td>
              <td>15 Mar 2026</td>
            </tr>
            <tr>
              <td className="py-2">Design Weekly</td>
              <td className="text-yellow-600">Expiring Soon</td>
              <td>10 Mar 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}