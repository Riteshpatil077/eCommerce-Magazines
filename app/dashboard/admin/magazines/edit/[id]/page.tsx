import { prisma } from "@/app/lib/prisma"
import { notFound } from "next/navigation"
import EditMagazineForm from "@/app/components/forms/EditMagazineForm"



// Define the type for the async params
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMagazinePage({ params }: PageProps) {
  // 1. Await the params Promise to get the actual ID
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch the magazine from the database
  const magazine = await prisma.magazine.findUnique({
    where: { id: id },
  });

  // 3. Handle cases where the ID doesn't exist in the DB
  if (!magazine) {
    notFound(); // Triggers the global not-found.tsx page
  }

  if (!magazine) return notFound()

  return <EditMagazineForm magazine={magazine} /> 
    

       
     
  
}