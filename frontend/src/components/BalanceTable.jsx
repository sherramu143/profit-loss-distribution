"use client";
import { useEffect, useState } from "react";
import api from "@/app/api/client";

export default function BalanceTable() {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBalances = async () => {
    try {
      const res = await api.get("/users/");
      console.log("API Response:", res.data); // 👈 check what your API returns
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.users || res.data.data || [];
      setBalances(data);
    } catch (err) {
      console.error("Error fetching balances:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">User Balances</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">User</th>
            <th className="p-2">Role</th>
            <th className="p-2">Balance</th>
            <th className="p-2">Share (%)</th>
          </tr>
        </thead>
        <tbody>
          {balances.length > 0 ? (
            balances.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{user.name}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">₹{Number(user.balance).toFixed(2)}</td>
                <td className="p-2">{user.share_percent}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
