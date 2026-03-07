"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { addToCart } from "@/app/actions/cart.actions"

export default function Section({ id, title, magazines, subscribedIds }: any) {

    return (
        <div id={id} className="px-6 md:px-12 scroll-mt-24">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-100 mb-8">{title}</h2>

            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">

                {magazines.map((mag: any) => {

                    const isSubscribed = subscribedIds.includes(mag.id)

                    return (
                        <div key={mag.id} className="snap-start relative min-w-[180px] md:min-w-[240px] aspect-[3/4] rounded-2xl overflow-hidden group bg-zinc-900 border border-white/5">

                            <Image
                                src={mag.coverImage}
                                alt={mag.title}
                                fill
                                sizes="240px"
                                className="object-cover"
                            />

                            <div className="absolute inset-x-0 bottom-0 p-5">

                                <h3 className="text-white">{mag.title}</h3>

                                {isSubscribed ? (
                                    <Link href={`/dashboard/read/${mag.slug}`}>
                                        Read
                                    </Link>
                                ) : (
                                    <form action={addToCart as any}>
                                        <input type="hidden" name="magazineId" value={mag.id} />
                                        <button>Add to Cart</button>
                                    </form>
                                )}

                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}