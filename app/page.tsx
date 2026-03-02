import Link from "next/link"
import { BookOpen, ArrowRight, Sparkles, Globe, Zap, CheckCircle } from "lucide-react"

const featuredMagazines = [
  { title: "Vogue India", category: "Fashion", color: "from-rose-900/40 to-rose-950", accent: "bg-rose-400", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80" },
  { title: "National Geographic", category: "Science", color: "from-yellow-900/40 to-yellow-950", accent: "bg-yellow-400", image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80" },
  { title: "Wired", category: "Technology", color: "from-cyan-900/40 to-cyan-950", accent: "bg-cyan-400", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" },
  { title: "Architectural Digest", category: "Design", color: "from-stone-800/40 to-stone-950", accent: "bg-stone-300", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
  { title: "Time", category: "News", color: "from-red-900/40 to-red-950", accent: "bg-red-400", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80" },
]

const perks = [
  { icon: Globe, label: "Read anywhere", desc: "Access on any device, anytime" },
  { icon: Zap, label: "Instant access", desc: "New issues the moment they drop" },
  { icon: Sparkles, label: "Curated picks", desc: "Handpicked publications for every taste" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-zinc-950" strokeWidth={2.5} />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">Pressly</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/40">
          <Link href="/store" className="hover:text-stone-100 transition-colors duration-150">Browse</Link>
          <Link href="#features" className="hover:text-stone-100 transition-colors duration-150">Features</Link>
          <Link href="#pricing" className="hover:text-stone-100 transition-colors duration-150">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/40 hover:text-stone-100 transition-colors duration-150 hidden md:block">
            Sign in
          </Link>
          <Link href="/register" className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm px-4 py-2 rounded-xl transition-colors duration-200">
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">

        {/* Background glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Eyebrow */}
        <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs tracking-[2px] uppercase font-medium px-4 py-2 rounded-full mb-8 animate-[fadeUp_0.5s_ease_both]">
          <Sparkles className="w-3 h-3" />
          India&apos;s Premier Magazine Platform
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-tight max-w-4xl animate-[fadeUp_0.6s_0.1s_ease_both_forwards] opacity-0">
          Every story,
          <br />
          <em className="italic text-amber-400">beautifully</em> delivered.
        </h1>

        <p className="mt-6 text-base md:text-lg text-white/40 max-w-xl leading-relaxed font-light animate-[fadeUp_0.6s_0.2s_ease_both_forwards] opacity-0">
          Subscribe to the world&apos;s best magazines — fashion, science, tech, design, and more — all in one elegant place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-10 animate-[fadeUp_0.6s_0.3s_ease_both_forwards] opacity-0">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold px-6 py-3.5 rounded-xl transition-all duration-200 text-sm group"
          >
            Start reading free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
          </Link>
          <Link
            href="/store"
            className="flex items-center gap-2 text-white/50 hover:text-stone-100 border border-white/10 hover:border-white/20 px-6 py-3.5 rounded-xl transition-all duration-200 text-sm"
          >
            Browse store
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-xs text-white/20 animate-[fadeUp_0.6s_0.4s_ease_both_forwards] opacity-0">
          Join <span className="text-white/40 font-medium">12,000+</span> readers across India
        </p>

        {/* Floating magazine strip */}
        <div className="relative mt-20 w-full max-w-5xl animate-[fadeUp_0.7s_0.5s_ease_both_forwards] opacity-0">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-4 overflow-hidden px-4">
            {featuredMagazines.map((mag, i) => (
              <div
                key={mag.title}
                className="shrink-0 w-40 md:w-48 rounded-2xl overflow-hidden border border-white/5 group cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative aspect-[3/4]">
                  <img src={mag.image} alt={mag.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${mag.color} opacity-60`} />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className={`inline-block text-[9px] tracking-[2px] uppercase font-semibold px-2 py-0.5 rounded-sm mb-1 ${mag.accent} text-zinc-950`}>
                      {mag.category}
                    </span>
                    <p className="text-xs font-serif font-semibold text-stone-100 leading-tight">{mag.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks bar ── */}
      <section className="border-y border-white/5 bg-zinc-900/30 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {perks.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200">{label}</p>
                <p className="text-xs text-white/30 mt-0.5 font-light">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="flex items-center justify-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-4 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Why Pressly
            <span className="block w-6 h-px bg-amber-400" />
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight">
            Reading, <em className="italic text-amber-400">reimagined</em>
          </h2>
          <p className="mt-4 text-white/35 text-sm max-w-md mx-auto leading-relaxed font-light">
            Everything you need to discover, read, and love the world&apos;s best publications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {[
            { title: "Curated catalogue", body: "Every magazine is handpicked by our editorial team for quality, depth, and relevance. No filler, only the best.", tag: "Discovery" },
            { title: "Offline reading", body: "Download any issue and read it on a plane, in the mountains, or anywhere without wifi. Your library travels with you.", tag: "Convenience" },
            { title: "Early access", body: "Subscribers get new issues the moment they are published — often before print readers even notice.", tag: "Exclusive" },
            { title: "Cancel anytime", body: "No lock-ins, no fine print. Subscribe month-to-month and stop whenever you like, instantly.", tag: "Flexibility" },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-900 p-8 group hover:bg-zinc-800/60 transition-colors duration-200">
              <span className="text-[10px] tracking-[2px] uppercase text-amber-400/60 font-medium">{f.tag}</span>
              <h3 className="font-serif text-xl font-semibold mt-2 mb-3 text-stone-100 group-hover:text-amber-400 transition-colors duration-200">{f.title}</h3>
              <p className="text-sm text-white/35 leading-relaxed font-light">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="flex items-center justify-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-4 font-medium">
              <span className="block w-6 h-px bg-amber-400" />
              Pricing
              <span className="block w-6 h-px bg-amber-400" />
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight">
              Simple, <em className="italic text-amber-400">honest</em> pricing
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Free */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-7 flex flex-col">
              <p className="text-xs tracking-[2px] uppercase text-white/30 font-medium mb-4">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-serif text-5xl font-bold text-stone-100">₹0</span>
              </div>
              <p className="text-xs text-white/25 mb-6">Forever free</p>
              <ul className="space-y-2.5 flex-1 mb-8">
                {["Browse all magazines", "Read free previews", "Wishlist up to 5"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white/40">
                    <CheckCircle className="w-4 h-4 text-white/20 shrink-0" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center border border-white/10 hover:border-white/20 text-white/50 hover:text-stone-100 text-sm font-medium py-2.5 rounded-xl transition-all duration-200">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-amber-400 rounded-2xl p-7 flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-300/30 rounded-full blur-2xl pointer-events-none" />
              <p className="text-xs tracking-[2px] uppercase text-zinc-800 font-semibold mb-4">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="font-serif text-5xl font-bold text-zinc-950">₹199</span>
                <span className="text-zinc-700 text-sm mb-1.5">/mo</span>
              </div>
              <p className="text-xs text-zinc-600 mb-6">Per magazine subscription</p>
              <ul className="space-y-2.5 flex-1 mb-8">
                {["Unlimited reading", "New issues instantly", "Offline downloads", "Cancel anytime"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-800 font-medium">
                    <CheckCircle className="w-4 h-4 text-zinc-700 shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/store" className="relative block text-center bg-zinc-950 hover:bg-zinc-800 text-amber-400 text-sm font-bold py-2.5 rounded-xl transition-all duration-200">
                Browse magazines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-amber-400/5 rounded-3xl blur-2xl pointer-events-none" />
          <div className="relative bg-zinc-900 border border-white/5 rounded-3xl px-8 py-16">
            <p className="text-[11px] tracking-[3px] uppercase text-amber-400 font-medium mb-4">Start today</p>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-tight tracking-tight mb-5">
              Your next favourite read<br />is one click away.
            </h2>
            <p className="text-white/35 text-sm max-w-sm mx-auto mb-8 font-light leading-relaxed">
              Join thousands of curious readers who have made Pressly their daily companion.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm group"
            >
              Create free account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-3 h-3 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-base font-bold">Pressly</span>
          </Link>
          <div className="flex items-center gap-6 text-xs text-white/25">
            <Link href="/store" className="hover:text-white/50 transition-colors">Browse</Link>
            <Link href="/login" className="hover:text-white/50 transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-white/50 transition-colors">Register</Link>
          </div>
          <p className="text-xs text-white/15">© {new Date().getFullYear()} Pressly. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}