import DashboardCard from "@/app/components/user/DashboardCard";

export default function UserDashboard() {
  return (
    // Added bg-black and text-white to the main container to fix the layout theme
    <div className="space-y-6 bg-zinc-950/90 backdrop-blur-md text-white min-h-screen p-8">

      <h2 className="text-2xl font-bold text-zinc-100">Overview</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Active Subscriptions" value="3" />
        <DashboardCard title="Total Magazines" value="12" />
        <DashboardCard title="Renewal Date" value="15 Mar 2026" />
      </div>

      {/* Recent Subscriptions */}
      {/* Changed bg-white to a dark zinc/slate color to match the image */}
      <div className="bg-zinc-900/50 border border-zinc-800 shadow-xl rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-zinc-300">
          Recent Subscriptions
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-xs tracking-wider">
              <th className="py-3 px-2">Magazine</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Expiry</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
              <td className="py-4 px-2">Tech Monthly</td>
              <td className="py-4 px-2">
                <span className="text-green-500 font-medium">Active</span>
              </td>
              <td className="py-4 px-2 text-zinc-500">15 Mar 2026</td>
            </tr>
            <tr className="hover:bg-zinc-800/30 transition-colors">
              <td className="py-4 px-2">Design Weekly</td>
              <td className="py-4 px-2">
                <span className="text-amber-500 font-medium">Expiring Soon</span>
              </td>
              <td className="py-4 px-2 text-zinc-500">10 Mar 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}