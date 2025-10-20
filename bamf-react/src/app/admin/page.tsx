"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';
import { Admin } from '@/types/api.types';

function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const isAdmin = user?.role === 'Admin';

  // Admin management states
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/admin/login');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Fetch admins on mount
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchAdmins();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const response = await adminService.getAll();

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setAdmins(response.data);
    }

    setLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const response = await adminService.create(username, password);

    if (response.error) {
      setError(response.error);
    } else {
      setSuccessMessage('Admin created successfully!');
      setUsername('');
      setPassword('');
      setShowCreateForm(false);
      fetchAdmins();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number, adminName: string) => {
    const confirmPassword = prompt(`Enter your password to confirm deletion of "${adminName}":`);
    if (!confirmPassword) return;

    const response = await adminService.delete(id, confirmPassword);

    if (response.error) {
      setError(response.error);
    } else {
      setSuccessMessage('Admin deleted successfully!');
      fetchAdmins();
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#171010" }}>
        <div className="text-center">
          <div
            className="h-12 w-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#362222", borderTopColor: "transparent" }}
          />
          <p className="text-white">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: "#171010" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">ADMIN PANEL</h1>
            <p className="text-gray-400">Logged in as: <span className="text-white font-semibold">{user?.email}</span></p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 text-white font-bold text-sm tracking-wider transition-all hover:scale-105"
              style={{ backgroundColor: "#362222" }}
            >
              {showCreateForm ? 'CANCEL' : 'CREATE ADMIN'}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 text-white font-bold text-sm tracking-wider transition-all hover:scale-105"
              style={{ backgroundColor: "#8B0000" }}
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 mb-6 text-white border-l-4" style={{ backgroundColor: "#362222", borderLeftColor: "#8B0000" }}>
            <div className="font-semibold mb-1">Error</div>
            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 mb-6 text-white border-l-4" style={{ backgroundColor: "#1a4d1a", borderLeftColor: "#00cc00" }}>
            <div className="font-semibold mb-1">Success</div>
            <div>{successMessage}</div>
          </div>
        )}

        {/* Create Admin Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateAdmin} className="mb-8 p-6" style={{ backgroundColor: "#2B2B2B" }}>
            <h3 className="text-2xl font-bold text-white mb-4">Create New Admin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="px-4 py-3 text-white outline-none border transition-all focus:border-white"
                style={{ backgroundColor: "#171010", borderColor: "#423F3E" }}
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-3 text-white outline-none border transition-all focus:border-white"
                style={{ backgroundColor: "#171010", borderColor: "#423F3E" }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-white font-bold text-sm tracking-wider hover:opacity-80 transition-all"
              style={{ backgroundColor: "#362222" }}
            >
              CREATE ADMIN
            </button>
          </form>
        )}

        {/* Admins Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div
              className="h-12 w-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: "#362222", borderTopColor: "transparent" }}
            />
            <p className="text-white mt-4">Loading admins...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-12 p-6 border" style={{ backgroundColor: "#2B2B2B", borderColor: "#362222" }}>
            <p className="text-gray-400 text-lg">No admins found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-6 border transition-all hover:scale-105"
                style={{ backgroundColor: "#2B2B2B", borderColor: "#362222" }}
              >
                <h3 className="text-xl font-bold text-white mb-2">{admin.userName}</h3>
                <p className="text-gray-400 mb-6">ID: {admin.id}</p>
                <button
                  onClick={() => handleDelete(admin.id, admin.userName)}
                  className="w-full px-4 py-2 text-white text-sm font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: "#362222" }}
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;