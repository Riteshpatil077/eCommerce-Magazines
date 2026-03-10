// import DashboardCard from "@/app/components/user/DashboardCard";

// export default function UserDashboard() {
//   return (
//     // Added bg-black and text-white to the main container to fix the layout theme
//     <div className="space-y-6 bg-zinc-950/90 text-white min-h-screen p-8">

//       <h2 className="text-2xl font-bold text-zinc-100">Overview</h2>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <DashboardCard title="Active Subscriptions" value="3" />
//         <DashboardCard title="Total Magazines" value="12" />
//         <DashboardCard title="Renewal Date" value="15 Mar 2026" />
//       </div>

//       {/* Recent Subscriptions */}
//       {/* Changed bg-white to a dark zinc/slate color to match the image */}
//       <div className="bg-zinc-900/50 border border-zinc-800 shadow-xl rounded-xl p-6">
//         <h3 className="text-lg font-semibold mb-4 text-zinc-300">
//           Recent Subscriptions
//         </h3>

//         <table className="w-full text-left">
//           <thead>
//             <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-xs tracking-wider">
//               <th className="py-3 px-2">Magazine</th>
//               <th className="py-3 px-2">Status</th>
//               <th className="py-3 px-2">Expiry</th>
//             </tr>
//           </thead>
//           <tbody className="text-zinc-300">
//             <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
//               <td className="py-4 px-2">Tech Monthly</td>
//               <td className="py-4 px-2">
//                 <span className="text-green-500 font-medium">Active</span>
//               </td>
//               <td className="py-4 px-2 text-zinc-500">15 Mar 2026</td>
//             </tr>
//             <tr className="hover:bg-zinc-800/30 transition-colors">
//               <td className="py-4 px-2">Design Weekly</td>
//               <td className="py-4 px-2">
//                 <span className="text-amber-500 font-medium">Expiring Soon</span>
//               </td>
//               <td className="py-4 px-2 text-zinc-500">10 Mar 2026</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }


//testing

// import { prisma } from "@/app/lib/prisma";
// import { getUserFromToken } from "@/app/lib/auth";
// import { redirect } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import { Clock, BookOpen, Calendar, ChevronRight } from "lucide-react";
// import DashboardCard from "@/app/components/user/DashboardCard";

// export default async function UserDashboard() {
//   const user = await getUserFromToken();
//   if (!user) redirect("/login");

//   // Fetch real subscriptions with magazine details
//   const subscriptions = await prisma.subscription.findMany({
//     where: {
//       userId: user.id,
//       isActive: true,
//       paymentStatus: "APPROVED"
//     },
//     include: {
//       magazine: true,
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const activeCount = subscriptions.length;
//   // Safe Dynamic Renewal Date Calculation
//   const nextRenewal = subscriptions.length > 0
//     ? (() => {
//       // 1. Get all valid (non-null) expiry dates
//       const validDates = subscriptions
//         .map((s) => s.expiryDate)
//         .filter((date) => date !== null);

//       // 2. If no valid dates exist, return a fallback string
//       if (validDates.length === 0) return "Not set";

//       // 3. Find the furthest date safely
//       const maxTime = Math.max(...validDates.map((d) => new Date(d).getTime()));
//       return new Date(maxTime).toLocaleDateString();
//     })()
//     : "No active plans";

//   return (
//     <div className="space-y-8 bg-zinc-950 text-white min-h-screen p-4 md:p-8">
//       <div>
//         <h2 className="text-3xl font-serif font-bold text-zinc-100">Welcome Back</h2>
//         <p className="text-zinc-500 text-sm mt-1">Manage your collection and continue reading.</p>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <DashboardCard title="Active Subscriptions" value={activeCount.toString()} />
//         <DashboardCard title="Library Size" value={activeCount.toString()} />
//         <DashboardCard title="Next Renewal" value={nextRenewal} />
//       </div>

//       {/* My Library - Visual Grid */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <h3 className="text-xl font-medium text-zinc-200">My Library</h3>
//           <Link href="/store" className="text-amber-400 text-xs font-bold uppercase hover:underline">Explore More</Link>
//         </div>

//         {subscriptions.length === 0 ? (
//           <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-3xl p-12 text-center">
//             <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
//             <p className="text-zinc-500">You haven't subscribed to any magazines yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {subscriptions.map((sub) => (
//               <div key={sub.id} className="group bg-zinc-900/50 border border-zinc-800 hover:border-amber-400/30 rounded-2xl p-4 transition-all flex gap-5">
//                 {/* Magazine Cover */}
//                 <div className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden shadow-2xl">
//                   <Image
//                     src={sub.magazine.coverImage}
//                     alt={sub.magazine.title}
//                     fill
//                     className="object-cover group-hover:scale-105 transition-transform"
//                   />
//                 </div>

//                 {/* Details */}
//                 <div className="flex-1 flex flex-col">
//                   <div className="flex justify-between items-start">
//                     <h4 className="font-serif text-lg font-bold">{sub.magazine.title}</h4>
//                     <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
//                   </div>

//                   <div className="mt-2 space-y-1.5">
//                     <div className="flex items-center gap-2 text-zinc-500 text-xs">
//                       <Calendar className="w-3.5 h-3.5" />
//                       <span>Expires: {new Date(sub.expiryDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-zinc-500 text-xs">
//                       <Clock className="w-3.5 h-3.5" />
//                       {/* Note: In a real app, you'd fetch 'lastReadPage' from a 'Progress' table */}
//                       <span>Last read: Page {sub.lastReadPage || 1}</span>
//                     </div>
//                   </div>

//                   <div className="mt-auto pt-4">
//                     <Link
//                       href={`/dashboard/read/${sub.magazine.slug}?page=${sub.lastReadPage || 1}`}
//                       className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-400 transition-colors"
//                     >
//                       Continue Reading <ChevronRight className="w-4 h-4" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { prisma } from "@/app/lib/prisma";
import { getUserFromToken } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, Calendar, ChevronRight, AlertCircle } from "lucide-react";
import DashboardCard from "@/app/components/user/DashboardCard";
import CheckoutToast from "@/app/components/dashboard/CheckoutToast";
import { Suspense } from "react";

export default async function UserDashboard() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: user.id,
      isActive: true,
      paymentStatus: "APPROVED"
    },
    include: {
      magazine: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = subscriptions.length;

  const nextRenewal = subscriptions.length > 0
    ? (() => {
      const validDates = subscriptions
        .map((s) => s.expiryDate)
        .filter((date): date is Date => date !== null);
      if (validDates.length === 0) return "Lifetime";
      const maxTime = Math.max(...validDates.map((d) => d.getTime()));
      return new Date(maxTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    })()
    : "No active plans";

  return (
    <div className="space-y-8 bg-zinc-950 text-white min-h-screen p-4 md:p-8">
      <Suspense fallback={null}>
        <CheckoutToast />
      </Suspense>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-100 italic tracking-tight">Your Collection</h2>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, {(user as any).name || "Reader"}. Pick up where you left off.</p>
        </div>
        <Link href="/store" className="bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 w-fit">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Browse Store
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Active Access" value={activeCount.toString()} />
        <DashboardCard title="Total Issues" value={activeCount.toString()} />
        <DashboardCard title="Furthest Expiry" value={nextRenewal} />
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-medium text-zinc-200 flex items-center gap-2">
          Reading Now
          <span className="w-8 h-[1px] bg-zinc-800"></span>
        </h3>

        {subscriptions.length === 0 ? (
          <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl p-16 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-500 mb-6">Your library is currently empty.</p>
            <Link href="/store" className="text-amber-400 font-bold uppercase text-xs tracking-widest border-b border-amber-400/30 pb-1">Start Subscribing</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscriptions.map((sub) => {
              // Logic for Expiry Warnings
              const daysLeft = sub.expiryDate
                ? Math.ceil((new Date(sub.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 999;
              const isExpiringSoon = daysLeft >= 0 && daysLeft <= 7;

              return (
                <div key={sub.id} className="group relative bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 rounded-3xl p-5 transition-all flex flex-col sm:flex-row gap-6">
                  {/* Magazine Cover */}
                  <div className="relative w-full sm:w-32 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <Image
                      src={sub.magazine.coverImage}
                      alt={sub.magazine.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl font-bold tracking-tight text-zinc-100">{sub.magazine.title}</h4>
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider ${isExpiringSoon ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}>
                        {isExpiringSoon ? "Renew Soon" : "Active"}
                      </span>
                    </div>

                    <div className="space-y-3 mt-2">
                      <div className="flex items-center gap-3 text-zinc-400">
                        <Calendar className={`w-4 h-4 ${isExpiringSoon ? "text-amber-500" : "text-zinc-600"}`} />
                        <span className="text-xs">
                          {sub.expiryDate ? `Valid until ${new Date(sub.expiryDate).toLocaleDateString()}` : "Lifetime Access"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-zinc-400">
                        <Clock className="w-4 h-4 text-zinc-600" />
                        <span className="text-xs font-medium italic">Jump to Page {(sub as any).lastReadPage || 1}</span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <Link
                        href={`/dashboard/read/${sub.magazine.slug}?page=${(sub as any).lastReadPage || 1}`}
                        className="flex items-center gap-2 bg-amber-400 text-zinc-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
                      >
                        Read Issue <ChevronRight className="w-4 h-4" />
                      </Link>

                      {isExpiringSoon && (
                        <div className="flex items-center gap-1.5 text-amber-500 animate-pulse">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase">{daysLeft} days left</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}