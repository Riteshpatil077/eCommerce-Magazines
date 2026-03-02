"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, ImageIcon, ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

export default function EditMagazineForm({ magazine }: any) {
  const router = useRouter()

  const [title, setTitle] = useState(magazine.title)
  const [price, setPrice] = useState(magazine.price)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data.fileUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      let coverUrl = magazine.coverImage
      let pdfUrl = magazine.pdfUrl
      if (coverImage) coverUrl = await uploadFile(coverImage)
      if (pdfFile) pdfUrl = await uploadFile(pdfFile)

      const res = await fetch(`/api/admin/magazines/${magazine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price: parseFloat(price), coverImage: coverUrl, pdfUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push("/dashboard/admin/magazines")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm mb-10 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Magazines
        </button>

        {/* Header */}
        <div className="mb-10">
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Admin Panel
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            Edit <em className="italic text-amber-400">Magazine</em>
          </h1>
          <p className="mt-2 text-sm text-white/25 font-light">
            Updating: <span className="text-white/50">{magazine.title}</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Card */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8">

          {/* Current cover preview */}
          {magazine.coverImage && (
            <div className="mb-6 flex items-center gap-4 p-4 bg-zinc-800/50 border border-white/5 rounded-xl">
              <img
                src={magazine.coverImage}
                alt={magazine.title}
                className="w-12 h-16 object-cover rounded-md border border-white/10 shrink-0"
              />
              <div>
                <p className="text-xs tracking-[1px] uppercase text-white/25 mb-0.5">Current cover</p>
                <p className="text-sm text-stone-300 font-medium">{magazine.title}</p>
                <p className="text-xs text-amber-400">₹{magazine.price} / month</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Magazine Title
              </label>
              <input
                type="text"
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Subscription Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 text-sm font-medium">₹</span>
                <input
                  type="number"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* File uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                  Replace Cover <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                </label>
                <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all duration-200 group
                  ${coverImage
                    ? "border-amber-400/40 bg-amber-400/5"
                    : "border-white/10 bg-zinc-800 hover:border-white/20 hover:bg-zinc-700/50"
                  }`}>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                  {coverImage ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                      <p className="text-xs text-amber-400 font-medium text-center truncate w-full text-center">{coverImage.name}</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                      <p className="text-xs text-white/25 text-center">Upload new image</p>
                      <p className="text-[10px] text-white/15">PNG, JPG, WEBP</p>
                    </>
                  )}
                </label>
              </div>

              {/* PDF */}
              <div className="space-y-2">
                <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                  Replace PDF <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                </label>
                <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all duration-200 group
                  ${pdfFile
                    ? "border-violet-400/40 bg-violet-400/5"
                    : "border-white/10 bg-zinc-800 hover:border-white/20 hover:bg-zinc-700/50"
                  }`}>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                  {pdfFile ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-violet-400" />
                      <p className="text-xs text-violet-400 font-medium text-center truncate w-full text-center">{pdfFile.name}</p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                      <p className="text-xs text-white/25 text-center">Upload new PDF</p>
                      <p className="text-[10px] text-white/15">PDF only</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold text-sm py-3.5 rounded-xl tracking-wide transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Only changed fields will be updated. Existing files are preserved if not replaced.
        </p>
      </div>
    </div>
  )
}