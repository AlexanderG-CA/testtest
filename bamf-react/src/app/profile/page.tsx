"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import AccountSettings from "@/components/Profile/AccountSettings";
import DangerZone from "@/components/Profile/DangerZone";
import OrderHistory from "@/components/Profile/OrderHistory";

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("john.doe@example.com");
  const [orderHistory] = useState([
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
  ]);

  return (
    <div className="min-h-screen bg-[#171010] text-white">
      {isAuthenticated ? (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <ProfileHeader />
          <AccountSettings email={email} setEmail={setEmail} />
          <DangerZone />
          <OrderHistory orders={orderHistory} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <h2 className="text-3xl font-bold mb-4">You are not logged in</h2>
          <p className="text-gray-400">
            Please log in to view and manage your profile settings and order
            history.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
