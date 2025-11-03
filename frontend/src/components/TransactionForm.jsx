"use client";
import { useState, useEffect } from "react";
import api from "@/app/api/client";

export default function TransactionForm({ onSuccess }) {
  const [stake, setStake] = useState("");
  const [type, setType] = useState("profit");
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/users");
        const clientList = res.data.filter(u => u.role === "client");
        setClients(clientList);
        if (clientList.length > 0) setClientId(clientList[0].id);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profitLossValue =
        type === "profit" ? Number(stake) * 0.2 : Number(stake); // example 20% profit

      const body = {
        client_id: Number(clientId),
        stake_amount: Number(stake),
        profit_loss: profitLossValue,
        result_type: type,
      };

      const res = await api.post("/transactions", body);
      onSuccess?.(res.data);
      setStake("");
      setType("profit");
    } catch (err) {
      console.error(err);
      alert("Error recording transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Record Transaction</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Client</label>
        <select
          className="border rounded-md w-full p-2"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.role})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Stake Amount</label>
        <input
          type="number"
          className="border rounded-md w-full p-2"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="profit"
            checked={type === "profit"}
            onChange={(e) => setType(e.target.value)}
          />
          Profit
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="loss"
            checked={type === "loss"}
            onChange={(e) => setType(e.target.value)}
          />
          Loss
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
      >
        {loading ? "Processing..." : "Submit Transaction"}
      </button>
    </form>
  );
}
