"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

export default function CheckoutToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasToasted = useRef(false);

    useEffect(() => {
        if (searchParams.get("status") === "pending" && !hasToasted.current) {
            hasToasted.current = true;
            toast.success("Order placed successfully!", {
                icon: '🎉',
                style: {
                    background: '#18181b',
                    color: '#fbbf24',
                    border: '1px solid rgba(251, 191, 36, 0.2)'
                }
            });

            // Clean up URL
            router.replace('/dashboard/user', { scroll: false });
        }
    }, [searchParams, router]);

    return null;
}
