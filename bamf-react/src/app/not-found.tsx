"use client";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#171010" }}>
            <div className="max-w-2xl text-center">
                <h1 className="text-8xl md:text-9xl font-bold text-white mb-4">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    PAGE NOT FOUND
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                    Looks like you've ridden off the beaten path. This page doesn't exist.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <button
                            className="px-8 py-4 text-white font-bold text-sm tracking-wider transition-all transform hover:scale-105 cursor-pointer"
                            style={{ backgroundColor: "#362222" }}
                        >
                            BACK TO HOME
                        </button>
                    </Link>
                    <Link href="/shop">
                        <button
                            className="px-8 py-4 text-white font-medium text-sm tracking-wider border transition-colors cursor-pointer"
                            style={{ borderColor: "#423F3E", backgroundColor: "transparent" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2B2B2B")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            BROWSE SHOP
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}