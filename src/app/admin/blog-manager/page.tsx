'use client';
import React from "react";
import AdminLayout from "../components/admin-layout";

const AccountManager = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Blog Manager</h1>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AccountManager;