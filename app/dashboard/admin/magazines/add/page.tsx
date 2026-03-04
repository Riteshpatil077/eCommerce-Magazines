"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileText, Package, ImageIcon, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

export default function AddMagazinePage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [stock, setStock] = useState("") 

  async function handleUpload(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to upload file")
    return data.fileUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!coverImage || !pdfFile) throw new Error("Please upload both cover image and PDF")
      
      // 1. Upload files to get URLs
      const coverUrl = await handleUpload(coverImage)
      const pdfUrl = await handleUpload(pdfFile)

      // 2. Save magazine metadata to database
      const res = await fetch("/api/admin/magazines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, // Included description
          price: parseFloat(price),
          stock: parseInt(stock), 
          coverImage: coverUrl, 
          pdfUrl 
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create magazine")

      router.push("/dashboard/admin")
      router.refresh() // Refresh the server stats
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-stone-100 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/30 hover:text-white/70 text-sm mb-10 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back to Dashboard
        </button>

        {/* Page header */}
        <div className="mb-10">
          <p className="flex items-center gap-2 text-[11px] tracking-[3px] uppercase text-amber-400 mb-3 font-medium">
            <span className="block w-6 h-px bg-amber-400" />
            Admin Panel
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight">
            Add New <em className="italic text-amber-400">Magazine</em>
          </h1>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form card */}
        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Magazine Title
              </label>
              <input
                type="text"
                placeholder="e.g. National Geographic"
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
                  placeholder="0.00"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-8 pr-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

               <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Stock Quantity
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="number"
                  min="0"
                  placeholder="Enter available stock"
                  className="w-full bg-zinc-800 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                Description
              </label>
              <textarea
                placeholder="Write a short description about this magazine..."
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200 resize-none min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* File uploads row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                  Cover Image
                </label>
                <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 group
                  ${coverImage ? "border-amber-400/40 bg-amber-400/5" : "border-white/10 bg-zinc-800 hover:border-white/20 hover:bg-zinc-700/50"}`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    required
                  />
                  {coverImage ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-amber-400" />
                      <p className="text-xs text-amber-400 font-medium text-center truncate w-full px-2">
                        {coverImage.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
                      <p className="text-xs text-white/30 text-center">Click to upload image</p>
                      <p className="text-[10px] text-white/15 uppercase tracking-wider">PNG, JPG, WEBP</p>
                    </>
                  )}
                </label>
              </div>

              {/* PDF */}
              <div className="space-y-2">
                <label className="block text-xs tracking-[2px] uppercase text-white/40 font-medium">
                  Magazine PDF
                </label>
                <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 group
                  ${pdfFile ? "border-violet-400/40 bg-violet-400/5" : "border-white/10 bg-zinc-800 hover:border-white/20 hover:bg-zinc-700/50"}`}>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    required
                  />
                  {pdfFile ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-violet-400" />
                      <p className="text-xs text-violet-400 font-medium text-center truncate w-full px-2">
                        {pdfFile.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
                      <p className="text-xs text-white/30 text-center">Click to upload PDF</p>
                      <p className="text-[10px] text-white/15 uppercase tracking-wider">PDF ONLY</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Divider */}
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
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Publish Magazine
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-white/20 mt-6 italic">
          Files are uploaded securely to our cloud storage.
        </p>
      </div>
    </div>
  )
}