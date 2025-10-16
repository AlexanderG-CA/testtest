//temporary until we have a backend to handle user data, will most likely convert many things into components
"use client";

import React, { useState } from "react";
import { User, Package, ChevronRight, Eye, EyeOff, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginPopup from "@/components/Popups/LoginPopup";
import FullScreenPopup from "@/components/Popups/FullScreenPopup";

type EditType = "email" | "password";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  image: string;
}

export default function ProfilePage() {
  const { isAuthenticated, user, logout, showLoginPopup, setShowLoginPopup, isLoading } = useAuth();
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [editType, setEditType] = useState<EditType | "">("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [email, setEmail] = useState<string>("john.doe@example.com");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] =
    useState<string>("");
  const [showDeletePassword, setShowDeletePassword] = useState<boolean>(false);

  const orderHistory: Order[] = [
    {
      id: "ORD-2024-001",
      date: "2024-10-01",
      total: 149.99,
      status: "Delivered",
      items: 3,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    },
    {
      id: "ORD-2024-002",
      date: "2024-09-28",
      total: 89.5,
      status: "Delivered",
      items: 2,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    },
    {
      id: "ORD-2024-003",
      date: "2024-09-15",
      total: 299.99,
      status: "Delivered",
      items: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    },
    {
      id: "ORD-2024-004",
      date: "2024-08-22",
      total: 179.99,
      status: "Delivered",
      items: 4,
      image:
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
    },
  ];

  const handleEditClick = (type: EditType) => {
    setEditType(type);
    if (type === "email") {
      setIsEditingEmail(true);
      setNewEmail(email);
    } else {
      setIsEditingPassword(true);
    }
  };

  const handleDeleteAccount = () => {
    if (!deleteConfirmPassword) {
      alert("Please enter your password to confirm account deletion");
      return;
    }

    // In a real app, you would call an API to delete the account
    alert("Account deletion would be processed here");
    setShowDeleteModal(false);
    setDeleteConfirmPassword("");
  };

  const handleSaveClick = (type: EditType) => {
    setEditType(type);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!confirmPasswordInput) {
      alert("Please enter your password to confirm changes");
      return;
    }

    if (editType === "email") {
      setEmail(newEmail);
      setIsEditingEmail(false);
    } else if (editType === "password") {
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
      setIsEditingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }

    setShowConfirmModal(false);
    setConfirmPasswordInput("");
  };

  const handleCancel = (type: EditType) => {
    if (type === "email") {
      setIsEditingEmail(false);
      setNewEmail("");
    } else {
      setIsEditingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div>
      {
        isAuthenticated ? (

          <div className="min-h-screen" style={{ backgroundColor: "#171010" }}>
            <div className="max-w-6xl mx-auto px-4 py-12">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">
                  Manage your account settings and order history
                </p>
              </div>

              {/* Profile Section */}
              <div
                className="rounded-lg p-8 mb-8"
                style={{ backgroundColor: "#2B2B2B" }}
              >
                <div className="flex items-center mb-8">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: "#362222" }}
                  >
                    <User className="w-10 h-10 text-gray-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      Account Settings
                    </h2>
                    <p className="text-gray-400">Manage your login credentials</p>
                  </div>
                </div>

                {/* Email Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={isEditingEmail ? newEmail : email}
                      onChange={(e) => setNewEmail(e.target.value)}
                      disabled={!isEditingEmail}
                      className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
                      style={{
                        backgroundColor: isEditingEmail ? "#362222" : "#423F3E",
                        opacity: isEditingEmail ? 1 : 0.7,
                        cursor: isEditingEmail ? "text" : "not-allowed",
                        border: isEditingEmail ? "2px solid #4a3535" : "none",
                      }}
                    />
                    {!isEditingEmail ? (
                      <button
                        onClick={() => handleEditClick("email")}
                        className="px-6 py-3 rounded-lg font-medium transition-colors"
                        style={{ backgroundColor: "#362222", color: "white" }}
                        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#4a3535";
                        }}
                        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#362222";
                        }}
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSaveClick("email")}
                          className="px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: "#362222", color: "white" }}
                          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#4a3535";
                          }}
                          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#362222";
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancel("email")}
                          className="px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: "#423F3E", color: "white" }}
                          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#504d4c";
                          }}
                          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#423F3E";
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  {!isEditingPassword ? (
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="••••••••••"
                        disabled
                        className="flex-1 px-4 py-3 rounded-lg text-white"
                        style={{
                          backgroundColor: "#423F3E",
                          opacity: 0.7,
                          cursor: "not-allowed",
                        }}
                      />
                      <button
                        onClick={() => handleEditClick("password")}
                        className="px-6 py-3 rounded-lg font-medium transition-colors"
                        style={{ backgroundColor: "#362222", color: "white" }}
                        onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#4a3535";
                        }}
                        onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#362222";
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New password"
                          className="w-full px-4 py-3 pr-12 rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: "#362222",
                            border: "2px solid #4a3535",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 pr-12 rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
                          style={{
                            backgroundColor: "#362222",
                            border: "2px solid #4a3535",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSaveClick("password")}
                          className="px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: "#362222", color: "white" }}
                          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#4a3535";
                          }}
                          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#362222";
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancel("password")}
                          className="px-6 py-3 rounded-lg font-medium transition-colors"
                          style={{ backgroundColor: "#423F3E", color: "white" }}
                          onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#504d4c";
                          }}
                          onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.backgroundColor = "#423F3E";
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Account Section */}
              <div
                className="rounded-lg p-8 mb-8"
                style={{ backgroundColor: "#2B2B2B" }}
              >
                <h2 className="text-xl font-semibold text-white mb-2">Danger Zone</h2>
                <p className="text-gray-400 mb-6">
                  Once you delete your account, there is no going back. Please be
                  certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 rounded-lg font-medium transition-colors border-2"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "#ff4444",
                    color: "#ff4444",
                  }}
                  onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#ff4444";
                    (e.currentTarget as HTMLButtonElement).style.color = "white";
                  }}
                  onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ff4444";
                  }}
                >
                  Delete Account
                </button>
              </div>

              {/* Order History Section */}
              <div className="rounded-lg p-8" style={{ backgroundColor: "#2B2B2B" }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-gray-300" />
                    <h2 className="text-2xl font-semibold text-white">
                      Order History
                    </h2>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    View All
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="overflow-x-auto -mx-8 px-8">
                  <div
                    className="flex gap-4 pb-4"
                    style={{ minWidth: "max-content" }}
                  >
                    {orderHistory.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-lg p-4 cursor-pointer transition-all hover:scale-105"
                        style={{
                          backgroundColor: "#362222",
                          minWidth: "280px",
                          maxWidth: "280px",
                        }}
                      >
                        <img
                          src={order.image}
                          alt={`Order ${order.id}`}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-semibold">{order.id}</p>
                              <p className="text-gray-400 text-sm">{order.date}</p>
                            </div>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: "#423F3E", color: "#a0d995" }}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div
                            className="flex justify-between items-center pt-2 border-t"
                            style={{ borderColor: "#423F3E" }}
                          >
                            <span className="text-gray-400 text-sm">
                              {order.items} items
                            </span>
                            <span className="text-white font-semibold">
                              ${order.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                <div
                  className="rounded-lg p-8 max-w-md w-full"
                  style={{ backgroundColor: "#2B2B2B" }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Confirm Changes
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Please enter your current password to confirm the changes.
                  </p>
                  <div className="relative mb-6">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      placeholder="Current password"
                      className="w-full px-4 py-3 pr-12 rounded-lg text-white focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "#362222",
                        border: "2px solid #4a3535",
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: "#362222", color: "white" }}
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#4a3535";
                      }}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#362222";
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmModal(false);
                        setConfirmPasswordInput("");
                      }}
                      className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: "#423F3E", color: "white" }}
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#504d4c";
                      }}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#423F3E";
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                <div
                  className="rounded-lg p-8 max-w-md w-full"
                  style={{ backgroundColor: "#2B2B2B" }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Delete Account
                  </h3>
                  <div
                    className="mb-6 p-4 rounded-lg"
                    style={{ backgroundColor: "#362222" }}
                  >
                    <p className="text-red-400 font-semibold mb-2">
                      ⚠️ Warning: This action cannot be undone!
                    </p>
                    <p className="text-gray-300 text-sm">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="text-gray-400 text-sm mt-2 ml-4 list-disc">
                      <li>All your personal information</li>
                      <li>Order history and data</li>
                      <li>Saved preferences</li>
                    </ul>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Please enter your password to confirm account deletion:
                  </p>
                  <div className="relative mb-6">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      value={deleteConfirmPassword}
                      onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-12 rounded-lg text-white focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "#362222",
                        border: "2px solid #4a3535",
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleDeleteAccount()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showDeletePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: "#ff4444", color: "white" }}
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#cc0000";
                      }}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#ff4444";
                      }}
                    >
                      Delete My Account
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteConfirmPassword("");
                      }}
                      className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: "#423F3E", color: "white" }}
                      onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#504d4c";
                      }}
                      onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "#423F3E";
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // If not authenticated, show login prompt
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#171010] text-white px-4">
            <h2 className="text-3xl font-bold mb-4">You are not logged in</h2>
            <p className="text-gray-400 mb-8 text-center">
              Please log in to view and manage your profile settings and order history.
            </p>
          </div>
        )
      }
    </div>
  );
}