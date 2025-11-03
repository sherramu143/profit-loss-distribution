"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import BalanceTable from "@/components/BalanceTable";
import ShareSettingForm from "@/components/ShareSettingsForm";
import HierarchyView from "@/components/UserHierarchy";
import TransactionHistory from "@/components/TransactionHistory";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard"); // default tab
  const [refreshKey, setRefreshKey] = useState(0); // for re-render after updates

  // Handle transaction success
  const handleTransactionSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Handle share updates
  const handleShareUpdate = (msg) => {
    alert(msg);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Profit & Loss Distribution System
      </h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["dashboard", "shareSettings", "transactionHistory", "userHierarchy"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {tab === "dashboard"
              ? "Dashboard"
              : tab === "shareSettings"
              ? "Share Settings"
              : tab === "transactionHistory"
              ? "Transaction History"
              : "User Hierarchy"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <TransactionForm key={refreshKey} onSuccess={handleTransactionSuccess} />
            </div>
            <div className="bg-white p-6 rounded shadow">
              <BalanceTable key={refreshKey} />
            </div>
          </div>
        )}

        {/* Share Settings */}
        {activeTab === "shareSettings" && (
          <div className="bg-white p-6 rounded shadow w-full">
            <ShareSettingForm key={refreshKey} onSuccess={handleShareUpdate} />
          </div>
        )}

        {/* Transaction History */}
        {activeTab === "transactionHistory" && (
          <div className="bg-white p-6 rounded shadow">
            <TransactionHistory key={refreshKey} />
          </div>
        )}

        {/* User Hierarchy */}
        {activeTab === "userHierarchy" && (
          <div className="bg-white p-6 rounded shadow">
            <HierarchyView key={refreshKey} />
          </div>
        )}
      </div>
    </main>
  );
}
