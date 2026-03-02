import { prisma } from "@/app/lib/prisma"

export default async function PaymentsPage() {
  const payments = await prisma.subscription.findMany({
    include: { user: true, magazine: true },
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Payments</h2>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th>User</th>
            <th>Magazine</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b">
              <td>{p.user.name}</td>
              <td>{p.magazine.title}</td>
              <td>{p.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}