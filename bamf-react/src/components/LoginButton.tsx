import React, { useState, useEffect, useRef } from "react";
import FullScreenPopup from "./Popups/FullScreenPopup";
import LoginPopup from "./Popups/LoginPopup";
import SignupPopup from "./Popups/SignupPopup";
import { useAuth } from '@/contexts/AuthContext';
import Link from "next/link";
import LoginAndRegister from "./Popups/LoginAndRegister";

export default function LoginButton() {
    const { isAuthenticated, user, logout, showLoginPopup, setShowLoginPopup, isLoading } = useAuth();
    const [loginOrSignup, setLoginOrSignup] = useState<"login" | "signup">("login");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('🔐 Auth State:', {
            isAuthenticated,
            isAdmin: user?.role?.toLocaleLowerCase() === 'admin',
            user,
            userRole: user?.role,
            tokens: {
                access: localStorage.getItem('accessToken'),
                refresh: localStorage.getItem('refreshToken')
            }
        });
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (showLoginPopup) {
            setLoginOrSignup("login");
        }
    }, [showLoginPopup]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = () => {
        setShowLoginPopup(false);
    };

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
    };

    // Wait for auth to load before rendering
    if (isLoading) {
        return <div className="px-5 py-2.5 text-sm font-bold text-white border-2 transition-all duration-300 hover:scale-105 hover:cursor-pointer active:scale-95 group"
            style={{
                borderColor: "#362222",
                backgroundColor: "#2B2B2B"
            }}>👤 LOADING</div>;
    }

    return (
        <div className="">
            {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
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
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            👤 <span className="tracking-wider">MENU</span>
                        </span>
                        <span
                            className="absolute inset-0 w-0 transition-all duration-300 group-hover:w-full"
                            style={{ backgroundColor: "rgba(139, 69, 69, 0.2)" }}
                        ></span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 md:w-56 bg-[#2B2B2B] border-2 border-[#362222] rounded shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info Section */}
                            <div className="px-4 py-3 border-b border-[#362222]">
                                <p className="text-white text-sm font-semibold truncate">
                                    {user?.email || "User"}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                {
                                    user?.role?.toLowerCase() === 'admin' && (
                                        <Link
                                            onClick={() => setDropdownOpen(false)}
                                            href="/admin"
                                            className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#362222] transition-colors duration-200 flex items-center gap-2"
                                        >
                                            🛠️ <span>Admin Panel</span>
                                        </Link>
                                    )
                                }
                                <Link
                                    onClick={() => setDropdownOpen(false)}
                                    href="/profile"
                                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#362222] transition-colors duration-200 flex items-center gap-2"
                                >
                                    👤 <span>Profile</span>
                                </Link>
                                <Link
                                    onClick={() => setDropdownOpen(false)}
                                    href="/settings"
                                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-[#362222] transition-colors duration-200 flex items-center gap-2"
                                >
                                    ⚙️ <span>Settings</span>
                                </Link>
                            </div>

                            {/* Logout Section */}
                            <div className="border-t border-[#362222]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full cursor-pointer text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-2"
                                >
                                    🚪 <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
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

            <LoginAndRegister open={showLoginPopup} onClose={handleClose} />
        </div>
    );
}