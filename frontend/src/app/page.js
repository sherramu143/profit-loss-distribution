"use client";

import TransactionForm from "@/components/TransactionForm";
import BalanceTable from "@/components/BalanceTable";
import ShareSettingForm from "@/components/ShareSettingsForm";
import HierarchyView from "@/components/UserHierarchy";
import { useState } from "react";

export default function Home() {
  const [selectedParent, setSelectedParent] = useState(null);

  const handleTransactionSuccess = () => {
    window.location.reload();
  };

  const handleShareUpdate = (msg) => {
    alert(msg);
    window.location.reload();
  };

  // 🔹 Handle when a user is clicked in hierarchy
  const handleUserSelect = (user) => {
    console.log("👆 Selected from hierarchy:", user);
    setSelectedParent(user);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Profit & Loss Distribution System
      </h1>

      {/* Transaction Form */}
      <TransactionForm onSuccess={handleTransactionSuccess} />

      {/* Balance Table */}
      <BalanceTable />

      {/* Hierarchy / Share Setting Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-center">
          Share Settings & Hierarchy
        </h2>

        {/* Hierarchy View */}
        <HierarchyView onUserSelect={handleUserSelect} />

        {/* Share Setting Form — automatically loads when user selected */}
        {selectedParent && (
          <div className="mt-6">
            <ShareSettingForm
              parentId={selectedParent.id}
              parentName={selectedParent.name}
              parentRole={selectedParent.role}
              onSuccess={(msg) => {
                console.log("✅ Share updated for:", selectedParent);
                handleShareUpdate(msg);
                setSelectedParent(null);
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
