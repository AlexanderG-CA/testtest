import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";

const AccountSettings = ({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (v: string) => void;
}) => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSaveEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmail(newEmail);
    setIsEditingEmail(false);
    setEmailError("");
  };

  const handleSavePassword = () => {
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError("");
  };

  return (
    <div className="rounded-xl p-10 mb-10 bg-[#2B2B2B] border border-[#3a3a3a]">
      <div className="flex items-center mb-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mr-5 bg-[#362222] ring-2 ring-[#4a3535]">
          <User className="w-10 h-10 text-gray-200" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Account Settings
          </h2>
          <p className="text-gray-400 mt-1">Manage your login credentials</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
            Email Address
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={isEditingEmail ? newEmail : email}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError("");
              }}
              disabled={!isEditingEmail}
              className={`flex-1 px-5 py-3.5 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all ${
                isEditingEmail
                  ? "bg-[#362222] border-2 border-[#4a3535]"
                  : "bg-[#423F3E] opacity-70 cursor-not-allowed"
              }`}
            />
            {!isEditingEmail ? (
              <button
                onClick={() => {
                  setIsEditingEmail(true);
                  setNewEmail(email);
                }}
                className="px-8 py-3.5 rounded-lg bg-[#362222] hover:bg-[#4a3535] text-white font-semibold transition-all hover:scale-105 active:scale-95 border border-[#4a3535]"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveEmail}
                  className="px-8 py-3.5 rounded-lg bg-[#ff4444] hover:bg-[#cc0000] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingEmail(false);
                    setEmailError("");
                  }}
                  className="px-8 py-3.5 rounded-lg bg-[#423F3E] hover:bg-[#504d4c] text-gray-300 font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
          {emailError && (
            <p className="text-[#ff4444] text-sm mt-2 font-medium">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
            Password
          </label>
          {!isEditingPassword ? (
            <button
              onClick={() => setIsEditingPassword(true)}
              className="px-8 py-3.5 rounded-lg bg-[#362222] hover:bg-[#4a3535] text-white font-semibold transition-all hover:scale-105 active:scale-95 border border-[#4a3535]"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Current password"
                  className="w-full px-5 py-3.5 pr-12 rounded-lg text-white font-medium bg-[#362222] border-2 border-[#4a3535] focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="New password (min. 8 characters)"
                  className="w-full px-5 py-3.5 pr-12 rounded-lg text-white font-medium bg-[#362222] border-2 border-[#4a3535] focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[#ff4444] text-sm font-medium">
                  {passwordError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSavePassword}
                  className="px-8 py-3.5 rounded-lg bg-[#ff4444] hover:bg-[#cc0000] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  Save Password
                </button>
                <button
                  onClick={() => {
                    setIsEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setPasswordError("");
                  }}
                  className="px-8 py-3.5 rounded-lg bg-[#423F3E] hover:bg-[#504d4c] text-gray-300 font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;