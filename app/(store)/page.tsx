import { prisma } from "@/app/lib/prisma"

export const dynamic = "force-dynamic"

export default async function StorePage() {
  const magazines = await prisma.magazine.findMany({
    where: { isActive: true }
  })

  return (
    <div className="grid grid-cols-3 gap-6">
      {magazines.map((mag) => (
        <div key={mag.id} className="bg-white shadow p-4 rounded-xl">
          <h2>{mag.title}</h2>
          <p>{mag.description}</p>
          <p>₹{mag.price}</p>
        </div>
      ))}
    </div>
  )
}