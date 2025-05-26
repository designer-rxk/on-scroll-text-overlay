"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollTextAnimationOptions {
  /** When to start the animation (0-1, where 0.8 means start when element is 80% visible) */
  startOffset?: number
  /** When to end the animation (negative values mean element can scroll past viewport) */
  endOffset?: number
  /** Transition duration in milliseconds */
  transitionDuration?: number
}

export function useScrollTextAnimation(options: UseScrollTextAnimationOptions = {}) {
  const { startOffset = 0.8, endOffset = 0.2, transitionDuration = 75 } = options

  const textRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lineHeight, setLineHeight] = useState(0)
  const [totalLines, setTotalLines] = useState(0)

  // Calculate line metrics
  const calculateLineMetrics = () => {
    if (textRef.current) {
      const element = textRef.current
      const computedStyle = window.getComputedStyle(element)
      const lineHeightValue = Number.parseFloat(computedStyle.lineHeight)
      const elementHeight = element.scrollHeight
      const calculatedTotalLines = Math.ceil(elementHeight / lineHeightValue)

      setLineHeight(lineHeightValue)
      setTotalLines(calculatedTotalLines)
    }
  }

  useEffect(() => {
    calculateLineMetrics()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return

      const element = textRef.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate when the element starts and ends being visible
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate start and end positions
      const startPosition = windowHeight * startOffset
      const endPosition = -elementHeight * endOffset

      // Calculate progress (0 to 1)
      let progress = 0
      if (elementTop <= startPosition && elementTop >= endPosition) {
        progress = (startPosition - elementTop) / (startPosition - endPosition)
      } else if (elementTop < endPosition) {
        progress = 1
      }

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress))
      setScrollProgress(progress)
    }

    const handleResize = () => {
      calculateLineMetrics()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [startOffset, endOffset])

  // Calculate the clip-path for left-to-right line-by-line animation
  const getClipPath = () => {
    if (lineHeight === 0 || totalLines === 0) return "polygon(0 0, 0 0, 0 0, 0 0)"

    // Calculate which line we're currently on
    const currentLineFloat = scrollProgress * totalLines
    const currentLineIndex = Math.floor(currentLineFloat)
    const currentLineProgress = currentLineFloat - currentLineIndex

    // Calculate positions as percentages
    const totalHeight = totalLines * lineHeight

    if (currentLineIndex >= totalLines) {
      // All lines completed
      return "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }

    if (currentLineIndex === 0 && currentLineProgress === 0) {
      // Nothing revealed yet
      return "polygon(0 0, 0 0, 0 0, 0 0)"
    }

    // Calculate the top and bottom of the current line as percentages
    const currentLineTop = ((currentLineIndex * lineHeight) / totalHeight) * 100
    const currentLineBottom = (((currentLineIndex + 1) * lineHeight) / totalHeight) * 100
    const currentLineWidthProgress = currentLineProgress * 100

    // Create a polygon that reveals completed lines + current partial line
    if (currentLineIndex === 0) {
      // First line - simple left to right
      return `polygon(0 0, ${currentLineWidthProgress}% 0, ${currentLineWidthProgress}% ${currentLineBottom}%, 0 ${currentLineBottom}%)`
    } else {
      // Multiple lines - completed lines + current partial line
      return `polygon(
        0 0, 
        100% 0, 
        100% ${currentLineTop}%, 
        ${currentLineWidthProgress}% ${currentLineTop}%, 
        ${currentLineWidthProgress}% ${currentLineBottom}%, 
        0 ${currentLineBottom}%
      )`
    }
  }

  // Get styles for the overlay element
  const getOverlayStyles = (overlayColor = "text-blue-400") => ({
    clipPath: getClipPath(),
    transitionDuration: `${transitionDuration}ms`,
    transitionTimingFunction: "ease-out",
    transitionProperty: "clip-path",
  })

  return {
    textRef,
    scrollProgress,
    currentLine: scrollProgress * totalLines,
    totalLines,
    lineHeight,
    getClipPath,
    getOverlayStyles,
  }
}
