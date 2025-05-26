"use client"

import { useScrollTextAnimation } from "@/hooks/use-scroll-text-animation"

interface AnimatedTextProps {
  children: string
  baseColor?: string
  overlayColor?: string
  className?: string
  startOffset?: number
  endOffset?: number
  transitionDuration?: number
}

export function AnimatedText({
  children,
  baseColor = "text-white",
  overlayColor = "text-blue-400",
  className = "",
  startOffset,
  endOffset,
  transitionDuration,
}: AnimatedTextProps) {
  const { textRef, getOverlayStyles } = useScrollTextAnimation({
    startOffset,
    endOffset,
    transitionDuration,
  })

  return (
    <div className="relative">
      {/* Base text */}
      <p ref={textRef} className={`${baseColor} ${className}`}>
        {children}
      </p>

      {/* Overlay text with animation */}
      <p className={`absolute inset-0 ${overlayColor} ${className}`} style={getOverlayStyles()}>
        {children}
      </p>
    </div>
  )
}
