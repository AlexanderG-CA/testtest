import Link from "next/link";

export default function Footer() {
    return (
        <footer className="px-6 py-12 border-t"
            style={{ backgroundColor: "#171010", borderColor: "#362222" }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h5 className="text-white font-bold mb-3 tracking-wider">SHOP</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="/new-arrivals" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link href="/best-sellers" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Best Sellers
                                </Link>
                            </li>
                            <li>
                                <Link href="/sale" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Sale
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-3 tracking-wider">INFO</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="/about" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Returns
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-3 tracking-wider">SUPPORT</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href="/contact" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/size-guide" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Size Guide
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-white font-bold mb-3 tracking-wider">FOLLOW</h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a href="#" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    TikTok
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-all inline-block hover:translate-x-1 duration-200">
                                    Pinterest
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t text-center text-sm text-gray-500"
                    style={{ borderColor: "#362222" }}>
                    © 2025 Rebel Threads. All rights reserved.
                </div>
            </div>
        </footer>
    );
}