"use client";
import React, { useState, useEffect } from "react";
import FullScreenPopup from "./Popups/EmptyPopup";
import LoginPopup from "./Popups/LoginPopup";
import SignupPopup from "./Popups/SignupPopup";
import { useAuth } from '@/contexts/AuthContext';

export default function LoginButton() {
    const { isAuthenticated, user, logout, showLoginPopup, setShowLoginPopup } = useAuth();
    const [loginOrSignup, setLoginOrSignup] = useState<"login" | "signup">("login");

    // Sync local state with context state
    useEffect(() => {
        if (showLoginPopup) {
            setLoginOrSignup("login");
        }
    }, [showLoginPopup]);

    const handleClose = () => {
        setShowLoginPopup(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="">
            {isAuthenticated ? (
                <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm hidden sm:inline">
                        {user?.email}
                    </span>
                    <button
                        className="px-5 py-2.5 text-sm font-bold text-white border-2 transition-all duration-300 hover:scale-105 hover:cursor-pointer active:scale-95 group"
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
                        onClick={handleLogout}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            🚪 <span className="tracking-wider">LOGOUT</span>
                        </span>
                        <span
                            className="absolute inset-0 w-0 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: "rgba(139, 69, 69, 0.2)" }}
                        ></span>
                    </button>
                </div>
            ) : (
                <button
                    className="px-5 py-2.5 text-sm font-bold text-white border-2 transition-all duration-300 hover:scale-105 hover:cursor-pointer active:scale-95 group"
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
                    onClick={() => setShowLoginPopup(true)}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        🔐 <span className="tracking-wider">LOGIN</span>
                    </span>
                    <span
                        className="absolute inset-0 w-0 transition-all duration-300 group-hover:w-full"
                        style={{ backgroundColor: "rgba(139, 69, 69, 0.2)" }}
                    ></span>
                </button>
            )}

            {/* Popup */}
            <FullScreenPopup open={showLoginPopup} onClose={handleClose}>
                {loginOrSignup === "login" ? (
                    <LoginPopup onSignupClick={() => {
                        setLoginOrSignup("signup");
                    }} />
                ) : (
                    <SignupPopup onLoginClick={() => {
                        setLoginOrSignup("login");
                    }} />
                )}
            </FullScreenPopup>
        </div>
    );
}