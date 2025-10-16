"use client";
import { useState } from "react";
import LoginButton from "./LoginButton";
import CartButton from "./Cart/CartButton";
import Link from "next/link";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b backdrop-blur-sm"
            style={{
                borderColor: "#423F3E",
                backgroundColor: "rgba(23, 16, 16, 0.95)",
                boxShadow: "0 4px 6px -1px rgba(54, 34, 34, 0.3)"
            }}>
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="group cursor-pointer">
                        <h1 className="text-2xl font-bold text-white text-center tracking-wider transition-all">
                            BAMF{" "}
                            <span className="transition-all group-hover:tracking-widest" style={{ color: "#8B4545" }}>
                                GEAR
                            </span>
                        </h1>
                    </a>


                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-8 text-sm font-medium">
                        <Link href="/shop" className="relative text-gray-300 transition-colors hover:text-white group">
                            SHOP
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                                style={{ backgroundColor: "#362222" }}></span>
                        </Link>
                        <Link href="/collections" className="relative text-gray-300 transition-colors hover:text-white group">
                            COLLECTIONS
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                                style={{ backgroundColor: "#362222" }}></span>
                        </Link>
                        <Link href="/about" className="relative text-gray-300 transition-colors hover:text-white group">
                            ABOUT
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                                style={{ backgroundColor: "#362222" }}></span>
                        </Link>
                        <Link href="/contact" className="relative text-gray-300 transition-colors hover:text-white group">
                            CONTACT
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full"
                                style={{ backgroundColor: "#362222" }}></span>
                        </Link>
                    </div>

                    {/* Cart Button & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="not-sm:hidden gap-4 flex">
                            <CartButton />
                            <LoginButton />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden h-screen mt-4 pt-4 border-t space-y-3"
                        style={{ borderColor: "#362222" }}>
                        <Link href="/shop" className="block text-gray-300 hover:text-white transition-colors py-2">
                            SHOP
                        </Link>
                        <Link href="/collections" className="block text-gray-300 hover:text-white transition-colors py-2">
                            COLLECTIONS
                        </Link>
                        <Link href="/about" className="block text-gray-300 hover:text-white transition-colors py-2">
                            ABOUT
                        </Link>
                        <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors py-2">
                            CONTACT
                        </Link>
                        <div className="pt-4 border-t flex justify-center"
                            style={{ borderColor: "#362222" }}>
                            <LoginButton />
                        </div>
                        <div className="flex justify-center mt-4">
                            <CartButton />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}