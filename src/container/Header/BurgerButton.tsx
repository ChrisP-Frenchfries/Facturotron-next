// components/BurgerButton.tsx
"use client"

import * as React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

interface BurgerButtonProps {
    isOpen: boolean;
    onClick: () => void; // Propriété définie dans l'interface
}

export default function BurgerButton({ isOpen, onClick }: BurgerButtonProps): React.ReactElement {
    const [isMounted, setIsMounted] = React.useState<boolean>(false)
    const burgerRef = React.useRef<HTMLButtonElement>(null)

    // Animation pour les lignes du burger
    const topVariants: Variants = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: 45, y: 6 }
    }

    const centerVariants: Variants = {
        closed: { opacity: 1 },
        open: { opacity: 0 }
    }

    const bottomVariants: Variants = {
        closed: { rotate: 0, y: 0 },
        open: { rotate: -45, y: -6 }
    }

    React.useEffect(() => {
        setIsMounted(true)

        // Fonction pour émettre des particules
        const emitParticles = (): void => {
            if (!burgerRef.current) return

            const button = burgerRef.current
            const rect = button.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // Créer des particules
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div')

                // Style des particules
                particle.style.position = 'fixed'
                particle.style.width = '8px'
                particle.style.height = '8px'
                particle.style.borderRadius = '50%'
                particle.style.backgroundColor = i % 2 === 0 ? '#e8d8b0' : '#c00d0d'
                particle.style.zIndex = '9999'

                // Position initiale
                particle.style.left = `${centerX}px`
                particle.style.top = `${centerY}px`

                document.body.appendChild(particle)

                // Animation
                const angle = (i / 12) * Math.PI * 2
                const velocity = 10 + Math.random() * 15
                const xVelocity = Math.cos(angle) * velocity
                const yVelocity = Math.sin(angle) * velocity

                let posX = centerX
                let posY = centerY
                let opacity = 1
                let scale = 1

                const animate = (): void => {
                    posX += xVelocity
                    posY += yVelocity
                    opacity -= 0.03
                    scale -= 0.02

                    particle.style.left = `${posX}px`
                    particle.style.top = `${posY}px`
                    particle.style.opacity = opacity.toString()
                    particle.style.transform = `scale(${scale})`

                    if (opacity > 0) {
                        requestAnimationFrame(animate)
                    } else {
                        particle.remove()
                    }
                }

                requestAnimationFrame(animate)
            }
        }

        // Ajouter un écouteur d'événement pour le clic
        const buttonElement = burgerRef.current
        if (buttonElement) {
            buttonElement.addEventListener('click', emitParticles)
        }

        // Nettoyage
        return () => {
            if (buttonElement) {
                buttonElement.removeEventListener('click', emitParticles)
            }
        }
    }, [])

    return (
        <motion.button
            ref={burgerRef}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden bg-[#2c2c2c] h-12 w-12 rounded-full flex flex-col items-center justify-center border-4 border-[#e8d8b0] hover:bg-[#1a1a1a] p-0 gap-1.5 relative overflow-hidden"
            aria-label="Menu"
            onClick={onClick} // Utilisation de la propriété onClick
        >
            {/* Effet de pulsation - uniquement côté client */}
            {isMounted && (
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            className="absolute inset-0 bg-[#e8d8b0] rounded-full"
                            initial={{ scale: 0, opacity: 0.7 }}
                            animate={{
                                scale: [0, 1.5],
                                opacity: [0.7, 0]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 2,
                                repeatDelay: 1
                            }}
                        />
                    )}
                </AnimatePresence>
            )}

            {/* Lignes du burger animées */}
            <motion.div
                className="w-5 h-0.5 bg-[#e8d8b0] rounded-full"
                variants={topVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
            />
            <motion.div
                className="w-5 h-0.5 bg-[#e8d8b0] rounded-full"
                variants={centerVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
            />
            <motion.div
                className="w-5 h-0.5 bg-[#e8d8b0] rounded-full"
                variants={bottomVariants}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    )
}