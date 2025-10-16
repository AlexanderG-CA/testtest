import { useState } from "react";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
    const [cartCount] = useState(6);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {/* Enhanced Cart Button */}
            <button
                className="relative px-5 py-2.5 text-sm font-bold text-white border-2 transition-all duration-300 hover:scale-105 hover:cursor-pointer active:scale-95 group"
                style={{
                    borderColor: "#362222",
                    backgroundColor: "#2B2B2B"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#362222";
                    e.currentTarget.style.borderColor = "#8B4545";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2B2B2B";
                    e.currentTarget.style.borderColor = "#362222";
                }}
                onClick={() => setIsOpen(true)}
            >
                <span className="relative z-10 flex items-center gap-2">
                    🛒
                    <span className="tracking-wider">CART</span>
                </span>
                {cartCount > 0 && (
                    <span
                        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-xs font-bold text-white rounded-full animate-pulse"
                        style={{ backgroundColor: "#8B4545" }}
                    >
                        {cartCount}
                    </span>
                )}
                <span
                    className="absolute inset-0 w-0 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: "rgba(139, 69, 69, 0.2)" }}
                />
            </button>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
