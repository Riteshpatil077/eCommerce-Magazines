
import Link from "next/link"
import { BookOpen, ArrowRight, Sparkles, Globe, Zap, CheckCircle, ShieldCheck, Star } from "lucide-react"
import Image from "next/image"
const featuredMagazines = [
  { title: "Vogue India", category: "Fashion", color: "from-rose-500/20 to-zinc-950", accent: "text-rose-400 border-rose-400/20", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80" },
  { title: "Nat Geo", category: "Science", color: "from-amber-500/20 to-zinc-950", accent: "text-amber-400 border-amber-400/20", image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80" },
  { title: "Wired", category: "Technology", color: "from-cyan-500/20 to-zinc-950", accent: "text-cyan-400 border-cyan-400/20", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" },
  { title: "AD", category: "Design", color: "from-stone-500/20 to-zinc-950", accent: "text-stone-300 border-stone-300/20", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
  { title: "Time", category: "News", color: "from-red-500/20 to-zinc-950", accent: "text-red-400 border-red-400/20", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 selection:bg-amber-400 selection:text-zinc-900 font-sans">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-6 bg-zinc-950/70 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-110">
            <BookOpen className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight italic">Pressly</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40">
          <Link href="/store" className="hover:text-amber-400 transition-colors">Catalogue</Link>
          <Link href="#features" className="hover:text-amber-400 transition-colors">Experience</Link>
          <Link href="#pricing" className="hover:text-amber-400 transition-colors">Memberships</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register" className="bg-white text-zinc-950 font-bold text-[10px] uppercase tracking-[0.15em] px-7 py-3 rounded-full hover:bg-amber-400 transition-all active:scale-95">
            Register
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-44 pb-32 flex flex-col items-center text-center px-6 overflow-hidden">
        {/* Cinematic Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[9px] uppercase tracking-[3px] font-bold text-white/60">India's most curated library</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight leading-[0.95] tracking-tighter max-w-5xl">
          The Art of <br />
          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500">Reading.</span>
        </h1>

        <p className="mt-10 text-lg md:text-xl text-white/40 max-w-2xl font-light leading-relaxed">
          Elevate your daily intake with a bespoke collection of the world&apos;s most influential publications. Delivered digitally, experienced deeply.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5 mt-14">
          <Link href="/register" className="group flex items-center gap-3 bg-amber-400 text-zinc-950 font-black uppercase tracking-widest text-[10px] px-10 py-5 rounded-2xl hover:bg-white transition-all shadow-2xl shadow-amber-400/20">
            Start Your Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/store" className="text-[10px] uppercase tracking-widest font-bold border border-white/10 px-10 py-5 rounded-2xl hover:bg-white/5 transition-all">
            Explore Store
          </Link>
        </div>

        {/* Magazine Showcase */}
        <div className="mt-32 w-full max-w-7xl px-4 grid grid-cols-2 md:grid-cols-5 gap-6">
          {featuredMagazines.map((mag, i) => (
            <div
              key={mag.title}
              className="group relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 transition-all duration-700 hover:-translate-y-4 hover:border-amber-400/30 shadow-2xl"
            >
              {/* 2. PERFORMANCE FIX: Used next/image with priority and sizes */}
              <Image
                src={mag.image}
                alt={mag.title}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                priority={i < 3} // Preloads the first 3 images to fix LCP
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${mag.color}`} />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start">
                <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-1 rounded-md border ${mag.accent} mb-3`}>
                  {mag.category}
                </span>
                <h3 className="text-xl font-medium italic">{mag.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Premium Features ── */}
      <section id="features" className="py-32 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl md:text-5xl leading-tight mb-6">Built for the <br /><span className="italic text-amber-400 font-light">discerning</span> reader.</h2>
              <p className="text-white/40 font-light leading-relaxed">No ads, no distractions. Just pure editorial excellence wrapped in a world-class interface.</p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
              {[
                { icon: Globe, title: "Universal Library", desc: "Your entire collection synced across all high-resolution devices." },
                { icon: Zap, title: "Instant Arrival", desc: "First-look access to global editions before they hit the stands." },
                { icon: ShieldCheck, title: "Pure Experience", desc: "Ad-free reading environment focused entirely on the content." },
                { icon: Star, title: "Editorial Picks", desc: "Curated weekly highlights from our award-winning editors." }
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <item.icon className="w-6 h-6 text-amber-400 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-white/30 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing (The Membership) ── */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <p className="text-[9px] uppercase tracking-[4px] font-black text-amber-400 mb-4">Membership</p>
          <h2 className="text-5xl italic font-light">Simple. Transparent.</h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-[40px] border border-white/5 bg-zinc-900/50 flex flex-col items-start hover:border-white/20 transition-all">
            <span className="text-[9px] uppercase tracking-widest font-bold text-white/20 mb-8">Occasional Reader</span>
            <h3 className="text-4xl mb-4 italic">Complimentary</h3>
            <p className="text-white/40 text-sm font-light mb-10">Perfect for exploring our curated catalogue and free previews.</p>
            <div className="space-y-4 mb-12 flex-1 text-sm text-white/60">
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-white/20" /> Browse 500+ Publications</p>
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-white/20" /> Free Issue Previews</p>
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-white/20" /> Basic Account Cloud</p>
            </div>
            <Link href="/register" className="w-full text-center py-5 rounded-2xl border border-white/10 text-[10px] uppercase tracking-widest font-black hover:bg-white hover:text-black transition-all">Create Profile</Link>
          </div>

          <div className="p-10 rounded-[40px] bg-gradient-to-b from-amber-400 to-orange-500 flex flex-col items-start shadow-2xl shadow-orange-500/10">
            <div className="flex justify-between w-full items-start mb-8">
              <span className="text-[9px] uppercase tracking-widest font-black text-zinc-900/50">Full Access</span>
              <span className="bg-zinc-950 text-white text-[8px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">Most Popular</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4 text-zinc-950">
              <h3 className="text-5xl font-bold italic">₹199</h3>
              <span className="text-sm font-bold opacity-60">/per magazine</span>
            </div>
            <p className="text-zinc-900/60 text-sm font-bold mb-10 leading-relaxed">The ultimate reading experience with no boundaries or limitations.</p>
            <div className="space-y-4 mb-12 flex-1 text-sm text-zinc-900 font-bold">
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-zinc-950/30" /> Unlimited Full-Issue Reading</p>
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-zinc-950/30" /> Offline Library Mode</p>
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-zinc-950/30" /> Early Bird Digital Access</p>
              <p className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-zinc-950/30" /> Cancel Anytime Policy</p>
            </div>
            <Link href="/store" className="w-full text-center py-5 rounded-2xl bg-zinc-950 text-amber-400 text-[10px] uppercase tracking-widest font-black hover:scale-[1.02] active:scale-95 transition-all">Subscribe Now</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pt-20 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-zinc-950" />
              </div>
              <span className="text-lg font-bold italic">Pressly</span>
            </Link>
            <p className="text-[9px] uppercase tracking-[3px] text-white/10 font-bold">© {new Date().getFullYear()} Pressly Private Limited</p>
          </div>
          <div className="flex gap-10 text-[9px] uppercase tracking-widest font-black text-white/30">
            <Link href="#" className="hover:text-amber-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">Support</Link>
            <Link href="#" className="hover:text-amber-400 transition-colors">Instagram</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}



// import Link from "next/link"
// import { BookOpen, ArrowRight, Sparkles, Globe, Zap, CheckCircle, ShieldCheck, Star } from "lucide-react"
// import Image from "next/image"

// const featuredMagazines = [
//   { title: "Vogue India", category: "Fashion", color: "from-rose-500/20 to-zinc-950", accent: "text-rose-400 border-rose-400/20", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" },
//   { title: "Nat Geo", category: "Science", color: "from-amber-500/20 to-zinc-950", accent: "text-amber-400 border-amber-400/20", image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80" },
//   { title: "Wired", category: "Technology", color: "from-cyan-500/20 to-zinc-950", accent: "text-cyan-400 border-cyan-400/20", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
//   { title: "AD", category: "Design", color: "from-stone-500/20 to-zinc-950", accent: "text-stone-300 border-stone-300/20", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80" },
//   { title: "Time", category: "News", color: "from-red-500/20 to-zinc-950", accent: "text-red-400 border-red-400/20", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80" },
// ]

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-zinc-950 text-stone-100 selection:bg-amber-400 selection:text-zinc-900 font-sans">

//       <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-6 bg-zinc-950/70 backdrop-blur-xl border-b border-white/5">
//         <Link href="/" className="flex items-center gap-3 group">
//           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-110">
//             <BookOpen className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
//           </div>
//           <span className="text-xl font-bold tracking-tight italic">Pressly</span>
//         </Link>
//         {/* ... Nav Links ... */}
//       </nav>

//       <main> {/* Added <main> for Accessibility */}
//         <section className="relative pt-44 pb-32 flex flex-col items-center text-center px-6 overflow-hidden">
//           {/* 1. Performance: Used CSS opacity instead of heavy blur filters where possible */}
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

//           <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-10">
//             <Sparkles className="w-3.5 h-3.5 text-amber-400" />
//             <span className="text-[9px] uppercase tracking-[3px] font-bold text-white/60">India's most curated library</span>
//           </div>

//           <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight leading-[0.95] tracking-tighter max-w-5xl">
//             The Art of <br />
//             <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500">Reading.</span>
//           </h1>

//           <p className="mt-10 text-lg md:text-xl text-white/40 max-w-2xl font-light leading-relaxed">
//             Elevate your daily intake with a bespoke collection of the world&apos;s most influential publications.
//           </p>

//           {/* Magazine Showcase */}
//           <div className="mt-32 w-full max-w-7xl px-4 grid grid-cols-2 md:grid-cols-5 gap-6">
//             {featuredMagazines.map((mag, i) => (
//               <div
//                 key={mag.title}
//                 className="group relative aspect-[3/4.5] rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 transition-all duration-700 hover:-translate-y-4 hover:border-amber-400/30 shadow-2xl"
//               >
//                 {/* 2. PERFORMANCE FIX: Used next/image with priority and sizes */}
//                 <Image
//                   src={mag.image}
//                   alt={mag.title}
//                   fill
//                   sizes="(max-width: 768px) 50vw, 20vw"
//                   className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
//                   priority={i < 3} // Preloads the first 3 images to fix LCP
//                 />
//                 <div className={`absolute inset-0 bg-gradient-to-t ${mag.color} pointer-events-none`} />
//                 <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start pointer-events-none">
//                   <span className={`text-[8px] uppercase tracking-widest font-black px-2 py-1 rounded-md border ${mag.accent} mb-3`}>
//                     {mag.category}
//                   </span>
//                   <h2 className="text-xl font-medium italic">{mag.title}</h2> {/* Changed h3 to h2 for SEO order */}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//       {/* ... rest of sections ... */}
//     </div>
//   )
// }
