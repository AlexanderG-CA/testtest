"use client";

import { useState, useEffect } from 'react';
import { withAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';
import { Admin } from '@/types/api.types';

function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);

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

    const response = await adminService.create(username, password);

    if (response.error) {
      setError(response.error);
    } else {
      alert('Admin created successfully!');
      setUsername('');
      setPassword('');
      setShowCreateForm(false);
      fetchAdmins();
    }
  };

  const handleDelete = async (id: number) => {
    const confirmPassword = prompt('Enter your password to confirm deletion:');
    if (!confirmPassword) return;

    const response = await adminService.delete(id, confirmPassword);

    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      alert('Admin deleted successfully!');
      fetchAdmins();
    }
  };

  return (
    <div className="min-h-screen px-6 py-20" style={{ backgroundColor: "#171010" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">ADMIN PANEL</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 text-white font-bold text-sm tracking-wider transition-all hover:scale-105"
            style={{ backgroundColor: "#362222" }}
          >
            {showCreateForm ? 'CANCEL' : 'CREATE ADMIN'}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-white" style={{ backgroundColor: "#362222" }}>
            {error}
          </div>
        )}

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
                className="px-4 py-3 text-white outline-none border"
                style={{ backgroundColor: "#171010", borderColor: "#423F3E" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-3 text-white outline-none border"
                style={{ backgroundColor: "#171010", borderColor: "#423F3E" }}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-white font-bold text-sm tracking-wider"
              style={{ backgroundColor: "#362222" }}
            >
              CREATE
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: "#362222", borderTopColor: "transparent" }} />
            <p className="text-white mt-4">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin) => (
              <div key={admin.id} className="p-6 border" style={{ backgroundColor: "#2B2B2B", borderColor: "#362222" }}>
                <h3 className="text-xl font-bold text-white mb-2">{admin.userName}</h3>
                <p className="text-gray-400 mb-4">ID: {admin.id}</p>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="px-4 py-2 text-white text-sm font-medium hover:opacity-80"
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

// Wrap with auth HOC - requires admin role
export default withAuth(AdminPage, true);