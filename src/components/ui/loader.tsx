"use client"

import { cn } from "@/lib/utils"

export function Loader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex animate-spin items-center justify-center text-primary-foreground",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
