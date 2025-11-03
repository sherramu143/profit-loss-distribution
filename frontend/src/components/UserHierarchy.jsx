"use client";
import { useState, useEffect } from "react";
import api from "@/app/api/client";

export default function UserHierarchy({ onUserSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Recursive rendering of children
  const renderTree = (parentId, level = 0) => {
    return users
      .filter((u) => Number(u.parent_id) === Number(parentId))
      .map((user) => (
        <div
          key={user.id}
          style={{ paddingLeft: `${level * 20}px` }}
          className="cursor-pointer hover:text-blue-600"
          onClick={() => onUserSelect?.(user)}
        >
          {user.name} ({user.role})
          {renderTree(user.id, level + 1)}
        </div>
      ));
  };

  // Top-level users (admins)
  const topUsers = users.filter((u) => u.role.toLowerCase() === "admin");

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">User Hierarchy</h2>
      {topUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        topUsers.map((user) => (
          <div key={user.id} className="mb-1">
            <div
              style={{ paddingLeft: "0px" }}
              className="cursor-pointer hover:text-blue-600 font-medium"
              onClick={() => onUserSelect?.(user)}
            >
              {user.name} ({user.role})
            </div>
            {renderTree(user.id, 1)}
          </div>
        ))
      )}
    </div>
  );
}
