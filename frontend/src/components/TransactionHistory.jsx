"use client";

import { useState, useEffect } from "react";
import api from "@/app/api/client";

export default function TransactionHistory() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get("/users");
        setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClients();
  }, []);

  // Fetch transactions for selected client
  useEffect(() => {
    if (!selectedClient) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/transactions/${selectedClient}`);
        const data = res.data;

        // Group transactions by transaction ID
        const grouped = data.reduce((acc, t) => {
          if (!acc[t.id]) acc[t.id] = { ...t, shares: [] };
          if (t.user_id) {
            acc[t.id].shares.push({
              user_id: t.user_id,
              user_name: t.user_name || `User ${t.user_id}`,
              share_amount: t.share_amount,
            });
          }
          return acc;
        }, {});

        setTransactions(Object.values(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedClient]);

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Transaction History</h2>

      {/* Client Dropdown */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <select
          value={selectedClient || ""}
          onChange={(e) => setSelectedClient(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            minWidth: "220px",
          }}
        >
          <option value="" disabled>Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading transactions...</p>}

      {/* Transactions */}
      {!loading && transactions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {transactions.map((t, idx) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem 1.5rem",
                backgroundColor: "#fefefe",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              {/* Transaction Header */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span><strong>No. {idx + 1}</strong></span>
                <span style={{ color: Number(t.profit_loss) >= 0 ? "green" : "red" }}>
                  <strong>Profit/Loss:</strong> {Number(t.profit_loss).toFixed(2)}
                </span>
              </div>

              {/* Transaction Details */}
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Transaction ID:</strong> {t.id}
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Stake Amount:</strong> {Number(t.stake_amount).toFixed(2)}
              </div>

              {/* Shares */}
              {t.shares.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <strong>Shares:</strong>
                  <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                    {t.shares.map((s) => (
                      <li
                        key={s.user_id}
                        style={{
                          color: Number(s.share_amount) >= 0 ? "green" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {s.user_name}: {Number(s.share_amount).toFixed(2)}{" "}
                        {Number(s.share_amount) >= 0 ? "(Gain)" : "(Deduction)"}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: "0.5rem" }}>
                    <strong>Total Shares:</strong>{" "}
                    {t.shares.reduce((sum, s) => sum + Number(s.share_amount), 0).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && <p style={{ textAlign: "center" }}>No transactions found.</p>
      )}
    </div>
  );
}
