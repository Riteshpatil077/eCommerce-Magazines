"use client"

import { useActionState, useEffect } from "react"
import { resetPasswordAction } from "@/app/actions/auth.actions"
import { toast } from "react-hot-toast"
import Link from "next/link"
import { Mail, Lock, KeyRound, ArrowRight, BookOpen, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ResetPasswordForm({ initialEmail }: { initialEmail: string }) {
    const [state, formAction, isPending] = useActionState(resetPasswordAction, null)
    const router = useRouter()

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }

        if (state?.success) {
            toast.success(state.message || "Password changed successfully")
            setTimeout(() => {
                router.push("/login")
            }, 1500)
        }
    }, [state, router])

    return (
        <div className="min-h-screen bg-zinc-950 text-stone-100 flex items-center justify-center px-4">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2.5 mb-6">
                        <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
                        </div>
                        <span className="font-serif text-xl font-bold tracking-tight">Pressly</span>
                    </Link>

                    <p className="text-[11px] tracking-[3px] uppercase text-amber-400 font-medium mb-2">Secure</p>
                    <h1 className="font-serif text-3xl font-normal tracking-tight">
                        Reset <em className="italic text-amber-400">password</em>
                    </h1>
                    <p className="text-xs text-white/30 mt-2 font-light text-center">
                        Enter the OTP sent to your email and a new password
                    </p>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">
                    <form action={formAction} className="space-y-4" suppressHydrationWarning>
                        <div className="space-y-1.5">
                            <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={initialEmail}
                                    readOnly={!!initialEmail}
                                    required
                                    className={`w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200 ${initialEmail ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                                OTP
                            </label>
                            <div className="relative">
                                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                                <input
                                    name="otp"
                                    type="text"
                                    placeholder="6-digit OTP"
                                    maxLength={6}
                                    required
                                    className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200 tracking-widest"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                                    suppressHydrationWarning
                                />
                            </div>
                        </div>

                        <div className="h-px bg-white/5 my-2" />

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm py-3.5 rounded-xl tracking-wide transition-all duration-200 group"
                            suppressHydrationWarning
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
