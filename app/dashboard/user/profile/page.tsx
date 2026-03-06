import { prisma } from "@/app/lib/prisma"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { ShieldCheck, User, Mail, BadgeCheck, CalendarDays } from "lucide-react"

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!)

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  })

  const isAdmin = user?.role === "ADMIN"
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?"

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
    : null

  const fields = [
    { icon: User, label: "Full Name", value: user?.name ?? "Not set" },
    { icon: Mail, label: "Email Address", value: user?.email },
    { icon: BadgeCheck, label: "Role", value: isAdmin ? "Administrator" : "Member" },
    ...(joinedDate ? [{ icon: CalendarDays, label: "Member Since", value: joinedDate }] : []),
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-8 md:p-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Account
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            Your <em className="italic text-amber-400">Profile</em>
          </h1>
        </div>

        {/* Avatar card */}
        <div className="relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden mb-4">
          {/* Top gradient strip */}
          <div className={`h-24 w-full bg-gradient-to-r ${isAdmin ? "from-violet-900/60 to-violet-950" : "from-amber-900/40 to-zinc-900"}`} />

          {/* Avatar */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 border-zinc-900 shrink-0
                ${isAdmin
                  ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                  : "bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950"
                }`}>
                {initials}
              </div>
              <div className="pb-1">
                <h2 className="font-serif text-xl font-semibold text-stone-100 leading-tight">
                  {user?.name ?? <span className="text-white/30 italic font-normal text-base">No name set</span>}
                </h2>
                <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase font-semibold px-2.5 py-1 rounded-full mt-1
                  ${isAdmin ? "bg-violet-500/10 text-violet-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {isAdmin
                    ? <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                    : <User className="w-3 h-3" strokeWidth={2} />
                  }
                  {isAdmin ? "Admin" : "Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 bg-zinc-800/40">
            <p className="text-[10px] tracking-[2px] uppercase text-white/25 font-medium">Account Details</p>
          </div>

          <div className="divide-y divide-white/5">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-5 py-4">
                <div className="p-2 rounded-xl bg-white/5 text-white/30 shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[1.5px] uppercase text-white/25 font-medium mb-0.5">{label}</p>
                  <p className="text-sm text-stone-200 truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit hint */}
        <p className="text-center text-xs text-white/20 mt-6">
          To update your profile details, please contact support.
        </p>

      </div>
    </div>
  )
}