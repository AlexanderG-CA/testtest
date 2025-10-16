"use client";
// CartDrawer.jsx
export default function CartDrawer({ isOpen, onClose }) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`cursor-pointer absolute w-screen h-screen inset-0 bg-black transition-opacity duration-300 z-[60] ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Desktop: Slide from right */}
            <div
                className={`hidden sm:block absolute top-0 right-0 h-screen w-full sm:w-96 shadow-2xl transform transition-transform duration-300 ease-in-out z-[70] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    backgroundColor: "#1a1a1a",
                    borderLeft: "2px solid #362222"
                }}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-6 border-b" style={{ borderColor: "#362222" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">YOUR CART</h2>
                                <p className="text-gray-400 text-sm mt-1">6 items</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="text-gray-400">Cart functionality coming soon!</div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-6 border-t" style={{ borderColor: "#362222" }}>
                        <button
                            className="cursor-pointer w-full py-3 text-white font-bold rounded transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{ backgroundColor: "#8B4545" }}
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile: Bottom sheet */}
            <div
                className={`sm:hidden fixed bottom-0 left-0 right-0 w-full shadow-2xl transform transition-transform duration-300 ease-in-out z-[70] rounded-t-2xl ${isOpen ? 'translate-y-0 mb-[5.5rem]' : 'translate-y-full'
                    }`}
                style={{
                    backgroundColor: "#1a1a1a",
                    borderTop: "2px solid #362222",
                    maxHeight: "85vh"
                }}
            >
                <div className="h-full flex flex-col">
                    {/* Drag handle */}
                    <div className="pt-3 pb-2 flex justify-center">
                        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#362222" }} />
                    </div>

                    {/* Header */}
                    <div className="px-6 py-4 border-b" style={{ borderColor: "#362222" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">YOUR CART</h2>
                                <p className="text-gray-400 text-sm mt-1">6 items</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="text-gray-400">Cart functionality coming soon!</div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t" style={{ borderColor: "#362222" }}>
                        <button
                            className="cursor-pointer w-full py-3 text-white font-bold rounded transition-all duration-300 active:scale-95"
                            style={{ backgroundColor: "#8B4545" }}
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}