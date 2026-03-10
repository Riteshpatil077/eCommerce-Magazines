import ResetPasswordForm from "@/app/components/forms/reset-password-form"

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
    const email = (await searchParams).email || ""
    return <ResetPasswordForm initialEmail={email} />
}
