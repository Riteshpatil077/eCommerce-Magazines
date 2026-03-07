"use client"

import { Toaster } from "react-hot-toast"

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right" // Often better for dashboards
            toastOptions={{
                style: {
                    background: "#18181b", // zinc-900
                    color: "#fafaf9",      // stone-100
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    fontSize: "12px",
                },
                success: {
                    iconTheme: {
                        primary: "#fbbf24", // amber-400
                        secondary: "#18181b",
                    },
                },
            }}
        />
    )
}