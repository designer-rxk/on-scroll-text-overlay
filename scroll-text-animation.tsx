"use client"

import { AnimatedText } from "@/components/animated-text"
import { useScrollTextAnimation } from "@/hooks/use-scroll-text-animation"

export default function ScrollTextAnimation() {
  // You can also use the hook directly for more control
  const { scrollProgress, currentLine, totalLines } = useScrollTextAnimation()

  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse facilisis, ligula sit amet maximus luctus, dolor dolor tincidunt massa, in rhoncus purus lectus quis purus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam tincidunt neque ut tincidunt auctor. Curabitur malesuada vel mi in ultricies. Sed dignissim malesuada fermentum. Vestibulum dignissim et lectus sed pulvinar. Sed sit amet pulvinar lacus. Suspendisse odio dui, venenatis ac neque sed, eleifend condimentum augue. Fusce nec vestibulum ante, non malesuada lectus. Integer eu est sed risus ultricies auctor a id purus. Aenean at quam vehicula diam laoreet finibus ac ut lacus. Nunc cursus lectus vel varius iaculis. Donec eget posuere urna, vel dignissim lectus. Phasellus hendrerit erat nec eros scelerisque, vel dignissim felis placerat. Phasellus pharetra venenatis risus, sed auctor est varius nec."

  return (
    <div className="min-h-screen bg-black">
      {/* Spacer to allow scrolling */}
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Scroll down to see the animation</h1>
      </div>

      {/* Animated text using the component */}
      <div className="py-20 px-8 max-w-4xl mx-auto">
        <AnimatedText
          baseColor="text-white"
          overlayColor="text-blue-400"
          className="text-2xl leading-relaxed font-medium"
          startOffset={0.8}
          endOffset={0.2}
          transitionDuration={75}
        >
          {text}
        </AnimatedText>
      </div>

      {/* Another example with different colors */}
      <div className="py-20 px-8 max-w-4xl mx-auto">
        <AnimatedText
          baseColor="text-gray-400"
          overlayColor="text-green-400"
          className="text-xl leading-relaxed"
          startOffset={0.7}
          endOffset={0.3}
        >
          This is another paragraph with different colors and settings. You can easily reuse the animation with any text
          content and customize the appearance.
        </AnimatedText>
      </div>

      {/* More content to allow scrolling */}
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-3xl font-bold text-white">Multiple animated text blocks!</h2>
      </div>

      {/* Debug info */}
      <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg">
        <p className="text-sm">Scroll Progress: {Math.round(scrollProgress * 100)}%</p>
        <p className="text-sm">Current Line: {Math.round(currentLine * 10) / 10}</p>
        <p className="text-sm">Total Lines: {totalLines}</p>
      </div>
    </div>
  )
}
