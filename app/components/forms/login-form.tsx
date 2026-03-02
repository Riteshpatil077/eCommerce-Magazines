"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/actions/auth.actions"
import toast from "react-hot-toast"
import Link from "next/link"
import { Mail, Lock, ArrowRight, BookOpen } from "lucide-react"

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null)

  if (state?.error) toast.error(state.error)

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight">Pressly</span>
          </Link>
          <p className="text-[11px] tracking-[3px] uppercase text-amber-400 font-medium mb-2">Welcome back</p>
          <h1 className="font-serif text-3xl font-normal tracking-tight">
            Sign <em className="italic text-amber-400">in</em>
          </h1>
          <p className="text-xs text-white/30 mt-2 font-light">Enter your credentials to continue reading</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
          <form action={formAction} className="space-y-5">

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
              <div className="flex items-center justify-between">
                <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                  Password
                </label>
                {/* <Link href="/forgot-password" className="text-[11px] text-amber-400/60 hover:text-amber-400 transition-colors duration-150">
                  Forgot password?
                </Link> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                />
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm py-3.5 rounded-xl tracking-wide transition-all duration-200 group"
            >
              Sign in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
            </button>

          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-xs text-white/25 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-150">
            Create one free
          </Link>
        </p>

      </div>
    </div>
  )
}