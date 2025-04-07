// src/components/MobileNav.tsx
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SheetClose } from "@/components/ui/sheet"
import PixelAnimation from "@/container/Header/PixelAnimation"

interface MobileNavProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps): React.ReactElement {
    // Variantes pour l'animation du conteneur
    const containerVariants = {
        hidden: { x: "100%", opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            x: "100%",
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 40,
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    }

    // Variantes pour les éléments du menu
    const itemVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        exit: {
            x: 50,
            opacity: 0,
            transition: { type: "spring", stiffness: 500, damping: 30 }
        }
    }

    // Variantes pour le footer
    const footerVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { delay: 0.5, type: "spring" }
        },
        exit: {
            y: 20,
            opacity: 0,
            transition: { type: "spring" }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Menu panel */}
                    <motion.div
                        className="fixed top-0 right-0 bottom-0 z-50 bg-[#2c2c2c] border-l-4 border-[#e8d8b0] p-0 w-[280px] shadow-xl"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex justify-end p-4">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-[#a00b0b] h-10 w-10 rounded-full flex items-center justify-center border-2 border-[#e8d8b0]"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5 text-[#e8d8b0]" />
                            </motion.button>
                        </div>

                        <nav className="flex flex-col space-y-1 mt-6 px-2">
                            {["Home", "About", "Games", "Contact"].map((item) => (
                                <motion.a
                                    key={item}
                                    href="#"
                                    className="text-[#e8d8b0] hover:text-white font-bold text-xl px-4 py-3 rounded-lg border-l-4 border-transparent hover:border-[#e8d8b0] hover:bg-[#1a1a1a] transition-colors"
                                    variants={itemVariants}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </nav>

                        <PixelAnimation />

                        <motion.div
                            className="absolute bottom-8 left-0 right-0 flex justify-center"
                            variants={footerVariants}
                        >
                            <div className="bg-[#e8d8b0] px-4 py-2 rounded-full">
                                <span className="text-[#c00d0d] font-bold">© 2025 Demo Next</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}