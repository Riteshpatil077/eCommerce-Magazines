"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/image";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/app/actions/cart.actions";

export default function MagazineSlider({ 
  magazines, 
  subscribedIds, 
  title, 
  id 
}: { 
  magazines: any[]; 
  subscribedIds: Set<string>; 
  title: string; 
  id: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // If we reached the end, snap back to start, else scroll right
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000); // Slides every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  if (magazines.length === 0) return null;

  return (
    <div 
      id={id} 
      className="px-6 md:px-12 scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="font-serif text-2xl md:text-3xl font-medium text-stone-100 mb-8">{title}</h2>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {magazines.map((mag) => {
          const isSubscribed = subscribedIds.has(mag.id);
          return (
            <div key={`${id}-${mag.id}`} className="snap-start relative min-w-[200px] md:min-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden group bg-zinc-900 border border-white/5 transition-all hover:border-amber-400/30">
              <Image
                src={mag.coverImage}
                alt={mag.title}
                fill
                sizes="(max-width: 768px) 200px, 280px"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
              
              {isSubscribed && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-xl">
                    Owned
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                <h3 className="text-base font-serif font-bold text-white mb-1 truncate">{mag.title}</h3>
                <p className="text-xs text-amber-400 font-bold mb-4">
                  {isSubscribed ? "Access Unlocked" : `₹${mag.price} / month`}
                </p>

                <div className="grid grid-cols-1 gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {isSubscribed ? (
                    <a
                      href={`/dashboard/read/${mag.slug}`}
                      className="w-full py-2.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg hover:bg-stone-200 transition-colors shadow-lg block"
                    >
                      Read Magazine
                    </a>
                  ) : (
                    <>
                      <form action={addToCart}>
                        <input type="hidden" name="magazineId" value={mag.id} />
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase text-center rounded-lg hover:bg-zinc-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Add to Cart
                        </button>
                      </form>
                      <a
                        href={`/store/${mag.slug}`}
                        className="w-full py-2.5 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase text-center rounded-lg hover:bg-amber-300 transition-colors shadow-lg block"
                      >
                        Subscribe Now
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}