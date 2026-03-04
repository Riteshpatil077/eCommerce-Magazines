// simple layout
export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow hover:shadow-lg transition">
      <h4 className="text-gray-500 text-sm">{title}</h4>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

