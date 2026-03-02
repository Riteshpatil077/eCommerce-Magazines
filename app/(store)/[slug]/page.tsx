import { prisma } from "@/app/lib/prisma"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function MagazinePage({ params }: PageProps) {
  const { slug } = await params  
  const magazine = await prisma.magazine.findUnique({
    where: { slug },
  })

  if (!magazine) return notFound()

  return (
    <div>
      <h1>{magazine.title}</h1>
      <p>{magazine.description}</p>
      <p>₹{magazine.price}</p>
    </div>
  )
}