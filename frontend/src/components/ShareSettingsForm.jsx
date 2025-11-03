"use client";
import { useState, useEffect } from "react";
import api from "@/app/api/client";

export default function ShareSettingForm({ parentId, parentName, parentRole, onSuccess }) {
  const [downlines, setDownlines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!parentId) return;

    const fetchDownlines = async () => {
      try {
        const res = await api.get("/users");
        const filtered = res.data.filter(
          (u) =>
            Number(u.parent_id) === Number(parentId) && // ✅ ensure numeric match
            ["admin", "manager", "agent"].includes(u.role)
        );
        setDownlines(filtered);
      } catch (err) {
        console.error("Failed to fetch downlines:", err);
      }
    };
    fetchDownlines();
  }, [parentId]);

  const handleChange = (id, value) => {
    setDownlines((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, share_percent: Number(value) } : user
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Promise.all(
        downlines.map((user) =>
          api.put(`/users/${user.id}/share`, {
            share_percent: user.share_percent,
          })
        )
      );
      onSuccess?.("Shares updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating shares");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mx-auto mt-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        Edit Shares for {parentName} ({parentRole})
      </h2>

      {downlines.length === 0 && (
        <p className="text-gray-600">No editable downline users found.</p>
      )}

      {downlines.map((user) => (
        <div key={user.id} className="mb-4">
          <label className="block font-medium mb-1">
            {user.name} ({user.role})
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={user.share_percent || ""}
            onChange={(e) => handleChange(user.id, e.target.value)}
            className="border rounded-md w-full p-2"
          />
        </div>
      ))}

      {downlines.length > 0 && (
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save Shares"}
        </button>
      )}
    </form>
  );
}
