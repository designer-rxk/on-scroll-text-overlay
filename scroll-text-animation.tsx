"use client"

import { AnimatedText } from "@/components/animated-text"
import { useScrollTextAnimation } from "@/hooks/use-scroll-text-animation"

export default function ScrollTextAnimation() {
  // You can also use the hook directly for more control
  const { scrollProgress, currentLine, totalLines } = useScrollTextAnimation()

  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisis, ligula sit amet maximus luctus, dolor dolor tincidunt massa, in rhoncus purus lectus quis purus."

  const heroText =
    "Welcome to our amazing platform where innovation meets excellence. We create extraordinary experiences that transform the way you work and live."

  return (
    <div className="min-h-screen bg-black">
      {/* Hero section example - animation starts after 20% scroll and completes by 60% */}
      <div className="h-screen flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8">
            <AnimatedText
              baseColor="text-white"
              overlayColor="text-blue-400"
              className="leading-tight"
              minThreshold={0} // Start animation after 20% page scroll
              maxThreshold={0.3} // Complete animation by 60% page scroll
              startOffset={0.9} // Element visibility threshold
              endOffset={0.1}
            >
              {heroText}
            </AnimatedText>
          </h1>
          <p className="text-xl text-gray-300">Scroll down to see more examples</p>
        </div>
      </div>

      {/* Regular content section */}
      <div className="py-20 px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Regular Animation</h2>
        <AnimatedText
          baseColor="text-white"
          overlayColor="text-green-400"
          className="text-2xl leading-relaxed font-medium"
          startOffset={0.8}
          endOffset={0.2}
          transitionDuration={120}
          // No thresholds - uses element-based animation only
        >
          {text}
        </AnimatedText>
      </div>

      {/* Another example with different thresholds */}
      <div className="py-20 px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Delayed Animation</h2>
        <AnimatedText
          baseColor="text-gray-400"
          overlayColor="text-purple-400"
          className="text-xl leading-relaxed"
          minThreshold={0.7} // Start animation after 70% page scroll
          maxThreshold={0.9} // Complete animation by 90% page scroll
          startOffset={0.8}
          endOffset={0.2}
        >
          This animation only starts when you've scrolled 70% of the page and completes by 90%. Perfect for content that
          should animate later in the scroll journey.
        </AnimatedText>
      </div>

      {/* More content to allow scrolling */}
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-white">End of page</h2>
      </div>

      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg">
        <p className="text-sm">
          Page Scroll:{" "}
          {Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%
        </p>
        <p className="text-sm">Animation Progress: {Math.round(scrollProgress * 100)}%</p>
        <p className="text-sm">Current Line: {Math.round(currentLine * 10) / 10}</p>
        <p className="text-sm">Total Lines: {totalLines}</p>
      </div>
    </div>
  )
}
