import React, { useEffect } from "react";

type FullScreenPopupProps = {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};

export default function FullScreenPopup({ open, onClose, children }: FullScreenPopupProps) {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        if (open) {
            document.body.style.overflow = "hidden";
            document.getElementById("blurOverlay")!.classList.remove("hidden");
        } else {
            document.body.style.overflow = originalOverflow;
            document.getElementById("blurOverlay")!.classList.add("hidden");
        }
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-52 w-screen h-screen"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop - clicking this closes the popup */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Content wrapper - centers content and allows children to control size */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 pointer-events-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 border border-white/10 shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-6 w-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                    </svg>
                </button>

                {/* Children content - re-enable pointer events and let children control size */}
                {children}
            </div>
        </div>
    );
}