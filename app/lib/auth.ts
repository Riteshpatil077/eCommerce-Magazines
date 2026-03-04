// import jwt from "jsonwebtoken"

// export function generateToken(user: any) {
//   return jwt.sign(
//     { id: user.id, role: user.role },
//     process.env.JWT_SECRET!,
//     { expiresIn: "7d" }
//   )
// }

// export function verifyToken(token: string) {
//   return jwt.verify(token, process.env.JWT_SECRET!)
// }


import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

// Add 'export' right here!
export async function getUserFromToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) return null

  try {
    // We use 'as any' or a specific interface so TypeScript knows about .id
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string };
  } catch (error) {
    return null
  }
}