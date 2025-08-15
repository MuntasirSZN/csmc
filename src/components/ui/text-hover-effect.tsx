'use client'
import { motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

export function TextHoverEffect({
  text,
  duration,
}: {
  text: string
  duration?: number
  automatic?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' })
  const [dimensions, setDimensions] = useState({ width: 800, height: 120 }) // Default larger dimensions

  // Calculate text dimensions on mount and window resize
  useEffect(() => {
    const calculateDimensions = () => {
      if (textRef.current) {
        const bbox = textRef.current.getBBox()
        // Add padding to ensure text is fully visible
        setDimensions({
          width: Math.max(800, bbox.width * 1.5), // At least 800px wide with 50% padding
          height: Math.max(120, bbox.height * 2), // At least 120px tall with 100% padding
        })
      }
    }

    // Run once after render
    const timer = setTimeout(calculateDimensions, 100)

    // Update on window resize
    window.addEventListener('resize', calculateDimensions)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateDimensions)
    }
  }, [text])

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect()
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100
      const newMaskPosition = {
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      }
      setMaskPosition(newMaskPosition)
    }
  }, [cursor])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={e => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none w-full"
      preserveAspectRatio="xMidYMid meet" // This helps maintain the aspect ratio
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        ref={textRef}
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-5xl md:text-7xl font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-5xl md:text-7xl font-bold dark:stroke-neutral-800"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-5xl md:text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  )
}
