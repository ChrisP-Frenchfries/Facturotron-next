// src/container/Header/PixelAnimation.tsx
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function PixelAnimation(): React.ReactElement | null {
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0)

    // Définir les positions pour simuler une animation par étapes
    const positions = [
        { x: 0, y: 0 },
        { x: 16, y: 0 },
        { x: 16, y: 16 },
        { x: 0, y: 16 },
        { x: 0, y: 0 }
    ]

    useEffect(() => {
        setIsMounted(true)

        // Simuler l'animation par étapes avec un intervalle
        const interval = setInterval(() => {
            setStep((prevStep) => (prevStep + 1) % positions.length)
        }, 500) // Changer toutes les 500ms pour simuler steps(4)

        return () => clearInterval(interval)
    }, [])

    if (!isMounted) return null

    return (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center overflow-hidden h-24">
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="relative"
            >
                {/* Pixel art style animation */}
                <div className="w-8 h-8 bg-[#e8d8b0] absolute left-0 top-0"></div>
                <div className="w-8 h-8 bg-[#e8d8b0] absolute left-8 top-0"></div>
                <div className="w-8 h-8 bg-[#e8d8b0] absolute left-16 top-0"></div>
                <motion.div
                    className="w-8 h-8 bg-[#c00d0d]"
                    style={{
                        x: positions[step].x,
                        y: positions[step].y
                    }}
                    // Transition instantanée entre les positions
                    transition={{ duration: 0 }}
                />
            </motion.div>
        </div>
    )
}