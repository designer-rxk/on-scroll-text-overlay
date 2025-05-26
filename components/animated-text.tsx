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
  /** Minimum scroll threshold (0-1) - animation won't start until this much of viewport is scrolled */
  minThreshold?: number
  /** Maximum scroll threshold (0-1) - animation will be complete by this point */
  maxThreshold?: number
}

export function AnimatedText({
  children,
  baseColor = "text-white",
  overlayColor = "text-blue-400",
  className = "",
  startOffset,
  endOffset,
  minThreshold,
  maxThreshold,
}: AnimatedTextProps) {
  const { textRef, getOverlayStyles } = useScrollTextAnimation({
    startOffset,
    endOffset,
    minThreshold,
    maxThreshold,
  })

  return (
    <div className="relative">
      {/* Base text */}
      <p ref={textRef} className={`${baseColor} ${className}`}>
        {children}
      </p>

      {/* Overlay text with animation - optimized for performance */}
      <p
        aria-hidden="true"
        className={`absolute inset-0 ${overlayColor} ${className} pointer-events-none`}
        style={{
          ...getOverlayStyles(),
          backfaceVisibility: "hidden", // Prevent flickering
          perspective: "1000px", // Better 3D rendering
        }}
      >
        {children}
      </p>
    </div>
  )
}
