"use client";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import BurgerButton from "./BurgerButton";
import MobileNav from "@/components/MobileNav";
import { ArchiveRestore, HomeIcon, NotebookPen, Receipt } from "lucide-react";
import Link from "next/link";

export type LinkData = {
    name: string;
    route: `/${string}`;
    Icon: React.ElementType;
};

const links: LinkData[] = [
    {
        name: "Accueil",
        route: "/",
        Icon: HomeIcon,
    },
    {
        name: "Facturotron",
        route: "/facturotron",
        Icon: ArchiveRestore,
    },
    {
        name: "Pricing",
        route: "/pricing",
        Icon: Receipt,
    },
    {
        name: "Login",
        route: "/login",
        Icon: NotebookPen,
    },

];

type NavLinkItemProps = LinkData & {};

function NavLinkItem({ name, route, Icon }: NavLinkItemProps) {
    return (
        <li>
            <Link href={route} className="flex items-center space-x-2 text-[#e8d8b0] hover:text-white font-bold">
                <Icon className="h-5 w-5" />
                <span>{name}</span>
            </Link>
        </li>
    );
}

export default function HeaderFacturotron(): React.ReactElement {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [logoHover, setLogoHover] = React.useState<boolean>(false);

    return (
        <header className="bg-[#c00d0d] border-b-8 border-[#8b0000] shadow-lg py-3">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {/* Logo circulaire avec SVG externe */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#e8d8b0] h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center border-4 border-[#c7b592] shadow-inner overflow-hidden relative"
                            onHoverStart={() => setLogoHover(true)}
                            onHoverEnd={() => setLogoHover(false)}
                        >
                            <div
                                className={`transition-opacity duration-300 absolute inset-0 flex items-center justify-center ${logoHover ? "opacity-0" : "opacity-100"
                                    }`}
                            >
                                <Image
                                    src="/facturotron.svg"
                                    alt="Logo"
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 md:h-7 md:w-7"
                                    style={{
                                        filter:
                                            "invert(11%) sepia(78%) saturate(6209%) hue-rotate(357deg) brightness(94%) contrast(114%)",
                                    }}
                                />
                            </div>
                            <div
                                className={`transition-opacity duration-300 absolute inset-0 flex items-center justify-center ${logoHover ? "opacity-100" : "opacity-0"
                                    }`}
                            >
                                <Image
                                    src="/facturotron.svg"
                                    alt="Logo"
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 md:h-7 md:w-7"
                                    style={{
                                        filter:
                                            "invert(13%) sepia(0%) saturate(1%) hue-rotate(248deg) brightness(95%) contrast(91%)",
                                    }}
                                />
                            </div>
                        </motion.div>
                        <span className="text-white font-bold text-lg md:text-xl tracking-wider uppercase bg-[#a00b0b] px-3 md:px-4 py-1 rounded-sm shadow-sm">
                            Facturotron
                        </span>
                    </div>

                    {/* Navigation pour desktop */}
                    <nav className="hidden md:block bg-[#2c2c2c] px-5 py-2 rounded-full shadow-inner border-2 border-[#e8d8b0]">
                        <ul className="flex space-x-8">
                            {links.map((link) => (
                                <NavLinkItem key={link.route} {...link} />
                            ))}
                        </ul>
                    </nav>

                    {/* Menu mobile avec animation créative */}
                    <BurgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
                    <MobileNav isOpen={isOpen} onClose={() => setIsOpen(false)} />
                </div>
            </div>
        </header>
    );
}