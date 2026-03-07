"use client"

import { useActionState, useEffect } from "react"
import { registerAction } from "../../actions/auth.actions"
import toast from "react-hot-toast"
import Link from "next/link"
import { User, Mail, Lock, ArrowRight, BookOpen, Sparkles, Loader2 } from "lucide-react"

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

<<<<<<< HEAD
  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    } else if (state && !state.error) {
      toast.success("Account created successfully")
    }
  }, [state])
=======
// Inside LoginForm.tsx

useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } 
    
    if (state?.success) {
      toast.success("Welcome to Pressly!");
      
      const path = state.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";

      const timer = setTimeout(() => {
        window.location.href = path;
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [state]);
>>>>>>> 795e929b28dc73d04e8fea1bd86ca13fdcfa5c0b

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">Pressly</span>
          </Link>
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs tracking-[2px] uppercase font-medium px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3 h-3" />
            Free to join
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-tight">
            Create <em className="italic text-amber-400">account</em>
          </h1>
          <p className="text-xs text-white/30 mt-2 font-light">Join 12,000+ readers across India</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
          <form action={formAction} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                <input
                  name="name"
                  type="text"
                  placeholder="Arjun Sharma"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>
              <p className="text-[11px] text-white/20 pl-1">Minimum 8 characters recommended</p>
            </div>

            <div className="h-px bg-white/5" />

            {/* Submit */}
           <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm py-3.5 rounded-xl tracking-wide transition-all duration-200 group"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                </>
              )}
            </button>
            {/* Terms note */}
            <p className="text-center text-[11px] text-white/20 leading-relaxed">
              By registering you agree to our{" "}
              <Link href="/terms" className="text-white/35 hover:text-white/60 underline underline-offset-2 transition-colors duration-150">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-white/35 hover:text-white/60 underline underline-offset-2 transition-colors duration-150">Privacy Policy</Link>
            </p>

          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-xs text-white/25 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-150">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}