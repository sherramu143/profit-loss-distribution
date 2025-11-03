"use client";

import TransactionForm from "@/components/TransactionForm";
import BalanceTable from "@/components/BalanceTable";
import ShareSettingForm from "@/components/ShareSettingsForm";
import HierarchyView from "@/components/UserHierarchy";
import TransactionHistory from "@/components/TransactionHistory";
import { useState } from "react";

export default function Home() {
  const [selectedParent, setSelectedParent] = useState(null);
  const [activePage, setActivePage] = useState("dashboard"); // default page

  const handleTransactionSuccess = () => {
    window.location.reload();
  };

  const handleShareUpdate = (msg) => {
    alert(msg);
    window.location.reload();
  };

  const handleUserSelect = (user) => {
    setSelectedParent(user);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Profit & Loss Distribution System
      </h1>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActivePage("dashboard")}
          className={`px-4 py-2 rounded ${
            activePage === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActivePage("shareSettings")}
          className={`px-4 py-2 rounded ${
            activePage === "shareSettings" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Share Settings
        </button>
        <button
          onClick={() => setActivePage("transactionHistory")}
          className={`px-4 py-2 rounded ${
            activePage === "transactionHistory" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Transaction History
        </button>
      </div>

      {/* Page Content */}
      <div className="mt-6">
        {/* Dashboard: Transaction Form + Balance Table */}
        {activePage === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <TransactionForm onSuccess={handleTransactionSuccess} />
            </div>
            <div className="bg-white p-6 rounded shadow">
              <BalanceTable />
            </div>
          </div>
        )}

        {/* Share Settings */}
        {activePage === "shareSettings" && (
          <div>
            <HierarchyView onUserSelect={handleUserSelect} />
            {selectedParent && (
              <div className="mt-6 bg-white p-6 rounded shadow">
                <ShareSettingForm
                  parentId={selectedParent.id}
                  parentName={selectedParent.name}
                  parentRole={selectedParent.role}
                  onSuccess={(msg) => {
                    handleShareUpdate(msg);
                    setSelectedParent(null);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Transaction History */}
        {activePage === "transactionHistory" && (
          <div className="bg-white p-6 rounded shadow">
            <TransactionHistory />
          </div>
        )}
      </div>
    </main>
  );
}
