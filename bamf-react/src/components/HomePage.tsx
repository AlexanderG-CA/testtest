"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
// At the top of your page.tsx

export default function HomePage() {
    const [email, setEmail] = useState("");

    const featuredProducts = [
        { name: "Leather Jacket", price: "$249", image: "🧥" },
        { name: "Studded Belt", price: "$45", image: "⛓️" },
        { name: "Combat Boots", price: "$189", image: "🥾" },
        { name: "Band Tee", price: "$35", image: "👕" },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#171010" }}>

            {/* Hero Section */}
            <section
                className="relative px-6 py-24 md:py-32 overflow-hidden"
                style={{ backgroundColor: "#171010" }}
            >
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-3xl">
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                            DEFY THE<br />ORDINARY
                        </h2>
                        <p className="text-xl text-white mb-8 max-w-xl p-4 rounded">
                            Premium leather, metal, and attitude. For those who live on the edge and dress like they mean it.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="px-8 py-4 text-white font-bold text-sm tracking-wider transition-all transform hover:scale-105 cursor-pointer"
                                style={{ backgroundColor: "#362222" }}
                            >
                                SHOP NOW
                            </button>
                            <button
                                className="px-8 py-4 text-white font-medium text-sm tracking-wider border transition-colors cursor-pointer"
                                style={{ borderColor: "#423F3E", backgroundColor: "transparent" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2B2B2B")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            >
                                VIEW COLLECTIONS
                            </button>
                        </div>
                    </div>
                </div>

                {/* Full-width hero image, keep bike fully visible */}
                <div className="not-sm:hidden absolute bottom-0 left-0 w-full pointer-events-none z-0">
                    <Image
                        src="/BAMF_HEADER.png"
                        alt="Grey mountain landscape with bike in foreground"
                        width={5564}
                        height={1745}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>
                <div
                    className="absolute bottom-0 left-0 w-full pointer-events-none border-b-12 border-[#171010] z-0"
                >
                </div>
            </section>

            {/* Featured Products */}
            {/* //TODO: Use API Call to fetch */}
            <section className="px-6 py-20" style={{ backgroundColor: "#2B2B2B" }}>
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-3xl font-bold text-white mb-12 text-center">FEATURED PIECES</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product, idx) => (
                            <Link href={`/products/${product.name}`} key={idx} className="group cursor-pointer">
                                <div className="group cursor-pointer">
                                    <div className="aspect-square flex items-center justify-center text-6xl mb-4 border transition-all"
                                        style={{ backgroundColor: "#171010", borderColor: "#362222" }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#423F3E"}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#362222"}>
                                        {product.image}
                                    </div>
                                    <h4 className="text-white font-medium mb-1">{product.name}</h4>
                                    <p className="text-gray-400">{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="px-6 py-20" style={{ backgroundColor: "#171010" }}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-8 border transition-all cursor-pointer"
                            style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#362222";
                                e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#2B2B2B";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}>
                            <h4 className="text-2xl font-bold text-white mb-3">BIKER</h4>
                            <p className="text-gray-400 mb-4">Authentic leather jackets, vests, and accessories built to last</p>
                            <span className="text-white text-sm font-medium">EXPLORE →</span>
                        </div>
                        <div className="p-8 border transition-all cursor-pointer"
                            style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#362222";
                                e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#2B2B2B";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}>
                            <h4 className="text-2xl font-bold text-white mb-3">EMO</h4>
                            <p className="text-gray-400 mb-4">Dark aesthetics, band merch, and statement pieces</p>
                            <span className="text-white text-sm font-medium">EXPLORE →</span>
                        </div>
                        <div className="p-8 border transition-all cursor-pointer"
                            style={{ borderColor: "#362222", backgroundColor: "#2B2B2B" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#362222";
                                e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#2B2B2B";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}>
                            <h4 className="text-2xl font-bold text-white mb-3">ACCESSORIES</h4>
                            <p className="text-gray-400 mb-4">Chains, studs, spikes, and everything metal</p>
                            <span className="text-white text-sm font-medium">EXPLORE →</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="px-6 py-20" style={{ backgroundColor: "#362222" }}>
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">JOIN THE REBELLION</h3>
                    <p className="text-gray-300 mb-8">Get exclusive drops, early access, and 15% off your first order</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-3 text-white placeholder-gray-500 border outline-none"
                            style={{ backgroundColor: "#171010", borderColor: "#423F3E" }}
                        />
                        <button className="px-8 py-3 text-white font-bold text-sm tracking-wider transition-all cursor-pointer"
                            style={{ backgroundColor: "#2B2B2B" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#171010"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2B2B2B"}>
                            SUBSCRIBE
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}