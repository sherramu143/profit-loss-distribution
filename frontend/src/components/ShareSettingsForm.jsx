"use client";
import { useState, useEffect } from "react";
import api from "@/app/api/client";

export default function ShareSettingForm({ parentId, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sharePercent, setSharePercent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        // ✅ Filter only admin, manager, and agent roles
        const filtered = res.data.filter((u) =>
          ["admin", "manager", "agent"].includes(u.role.toLowerCase())
        );
        setUsers(filtered);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // When selecting a user, show only that user
  useEffect(() => {
    if (selectedId) {
      const user = users.find((u) => u.id === Number(selectedId));
      setSelectedUser(user || null);
      setSharePercent(user?.share_percent || "");
    } else {
      setSelectedUser(null);
      setSharePercent("");
    }
  }, [selectedId, users]);

  // Save the updated share percent
  const handleSave = async () => {
    if (!selectedUser) return alert("⚠️ Select a user first");
    setLoading(true);
    try {
      console.log(
        `🟢 Updating share for user ID ${selectedUser.id} (${selectedUser.role}) to ${sharePercent}%`
      );

      const res = await api.put(`/users/${selectedUser.id}/share`, {
        share_percent: sharePercent,
      });

      console.log("✅ Share update response:", res.data);
      alert("✅ Share percentage updated successfully");

      // Refresh the page to reflect updated data
      window.location.reload();
    } catch (err) {
      console.error("❌ Error updating share:", err);
      alert("❌ Failed to update share");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Share Settings
      </h2>

      {/* Dropdown for selecting user */}
      <select
        className="border p-2 w-full mb-3 rounded-md"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">Select Editable User (Admin / Manager / Agent)</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>

      {/* Show selected user info */}
      {selectedUser && (
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
            <div>
              <p className="font-medium text-gray-900">{selectedUser.name}</p>
              <p className="text-sm text-gray-500">
                Role: {selectedUser.role}
              </p>
            </div>
            <input
              type="number"
              className="border p-2 w-24 rounded text-center"
              value={sharePercent}
              onChange={(e) => setSharePercent(e.target.value)}
              placeholder="%"
            />
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}