"use client"

import HTMLFlipBook from "react-pageflip"

export default function FlipReader({ pages }: any) {
  return (
    <HTMLFlipBook width={400} height={600}>
      {pages.map((page: string, i: number) => (
        <div key={i}>
          <img src={page} />
        </div>
      ))}
    </HTMLFlipBook>
  )
}