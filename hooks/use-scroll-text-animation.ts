"use client";

import { useEffect, useRef, useState } from "react";

interface UseScrollTextAnimationOptions {
  /** When to start the animation (0-1, where 0.8 means start when element is 80% visible) */
  startOffset?: number;
  /** When to end the animation (negative values mean element can scroll past viewport) */
  endOffset?: number;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** Minimum scroll threshold (0-1) - animation won't start until this much of viewport is scrolled */
  minThreshold?: number;
  /** Maximum scroll threshold (0-1) - animation will be complete by this point */
  maxThreshold?: number;
}

export function useScrollTextAnimation(
  options: UseScrollTextAnimationOptions = {}
) {
  const {
    startOffset = 0.8,
    endOffset = 0.2,
    transitionDuration = 75,
    minThreshold = 0,
    maxThreshold = 1,
  } = options;

  const textRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [totalLines, setTotalLines] = useState(0);

  // Calculate line metrics
  const calculateLineMetrics = () => {
    if (textRef.current) {
      const element = textRef.current;
      const computedStyle = window.getComputedStyle(element);
      const lineHeightValue = Number.parseFloat(computedStyle.lineHeight);
      const elementHeight = element.scrollHeight;
      const calculatedTotalLines = Math.ceil(elementHeight / lineHeightValue);

      setLineHeight(lineHeightValue);
      setTotalLines(calculatedTotalLines);
    }
  };

  useEffect(() => {
    calculateLineMetrics();
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking && textRef.current) {
        rafId = requestAnimationFrame(() => {
          if (!textRef.current) return;

          const element = textRef.current;
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const currentScrollY = window.scrollY;

          // Calculate scroll progress as a percentage of total document
          const documentScrollProgress =
            currentScrollY / (documentHeight - windowHeight);

          // Apply min/max thresholds to the scroll progress
          let thresholdProgress = 0;
          if (
            documentScrollProgress >= minThreshold &&
            documentScrollProgress <= maxThreshold
          ) {
            // Map the scroll progress within the threshold range to 0-1
            thresholdProgress =
              (documentScrollProgress - minThreshold) /
              (maxThreshold - minThreshold);
          } else if (documentScrollProgress > maxThreshold) {
            thresholdProgress = 1;
          }

          // Calculate element-based progress (original logic)
          const elementTop = rect.top;
          const elementHeight = rect.height;
          const startPosition = windowHeight * startOffset;
          const endPosition = -elementHeight * endOffset;

          let elementProgress = 0;
          if (elementTop <= startPosition && elementTop >= endPosition) {
            elementProgress =
              (startPosition - elementTop) / (startPosition - endPosition);
          } else if (elementTop < endPosition) {
            elementProgress = 1;
          }

          // Use the minimum of both progress calculations
          // This ensures animation only happens when both conditions are met
          const finalProgress = Math.min(thresholdProgress, elementProgress);

          // Clamp progress between 0 and 1
          const clampedProgress = Math.max(0, Math.min(1, finalProgress));

          // Only update if there's a meaningful change (reduces re-renders)
          setScrollProgress((prevProgress) => {
            const diff = Math.abs(prevProgress - clampedProgress);
            return diff > 0.001 ? clampedProgress : prevProgress;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      calculateLineMetrics();
    };

    // Use passive listeners for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [startOffset, endOffset, minThreshold, maxThreshold]);

  // Calculate the clip-path for left-to-right line-by-line animation
  const getClipPath = () => {
    if (lineHeight === 0 || totalLines === 0)
      return "polygon(0 0, 0 0, 0 0, 0 0)";

    // Calculate which line we're currently on
    const currentLineFloat = scrollProgress * totalLines;
    const currentLineIndex = Math.floor(currentLineFloat);
    const currentLineProgress = currentLineFloat - currentLineIndex;

    // Calculate positions as percentages
    const totalHeight = totalLines * lineHeight;

    if (currentLineIndex >= totalLines) {
      // All lines completed
      return "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
    }

    if (currentLineIndex === 0 && currentLineProgress === 0) {
      // Nothing revealed yet
      return "polygon(0 0, 0 0, 0 0, 0 0)";
    }

    // Calculate the top and bottom of the current line as percentages
    const currentLineTop =
      ((currentLineIndex * lineHeight) / totalHeight) * 100;
    const currentLineBottom =
      (((currentLineIndex + 1) * lineHeight) / totalHeight) * 100;

    // Smooth the progress to avoid visual artifacts
    const smoothProgress = Math.max(
      0,
      Math.min(100, currentLineProgress * 100)
    );

    if (currentLineIndex === 0) {
      // First line - simple left to right
      return `polygon(0 0, ${smoothProgress}% 0, ${smoothProgress}% ${currentLineBottom}%, 0 ${currentLineBottom}%)`;
    } else {
      // Multiple lines - ensure completed lines stay fully revealed
      // and current line animates smoothly from left to right

      if (smoothProgress < 0.1) {
        // At the very start of a new line, show all previous lines fully
        return `polygon(0 0, 100% 0, 100% ${currentLineTop}%, 0 ${currentLineTop}%)`;
      } else {
        // Normal animation - show completed lines + current partial line
        return `polygon(
        0 0, 
        100% 0, 
        100% ${currentLineTop}%, 
        ${smoothProgress}% ${currentLineTop}%, 
        ${smoothProgress}% ${currentLineBottom}%, 
        0 ${currentLineBottom}%
      )`;
      }
    }
  };

  // Get styles for the overlay element with optimized performance
  const getOverlayStyles = (overlayColor = "text-blue-400") => ({
    clipPath: getClipPath(),
    willChange: "clip-path",
    transform: "translateZ(0)", // Force hardware acceleration
    transitionDuration: `${transitionDuration}ms`,
    transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Even smoother easing
    transitionProperty: "clip-path",
  });

  return {
    textRef,
    scrollProgress,
    currentLine: scrollProgress * totalLines,
    totalLines,
    lineHeight,
    getClipPath,
    getOverlayStyles,
  };
}
