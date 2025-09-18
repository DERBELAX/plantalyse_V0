import React, { useState } from "react";
import AdminPlantManager from "./AdminPlantManager";
import AdminCategoryManager from "./AdminCategoryManager";
import AdminBlogManager from "./AdminBlogManager";
import AdminContactManager from "./AdminContactManager";
import AdminOrderManager from "./AdminOrderManager";
import AdminReminderManager from "./AdminReminderManager";
import AdminUserManager from "./AdminUserManager";
import AdminStockManager from "./AdminStockManager";
import AdminDashboardOverview from "./AdminDashboardOverview";
import styles from "../../styles/AdminDashboard.module.css";

const TABS = [
  { key: "plants", label: "Plantes", component: <AdminPlantManager /> },
  { key: "categories", label: "Catégories", component: <AdminCategoryManager /> },
  { key: "blogs", label: "Blogs", component: <AdminBlogManager /> },
  { key: "messages", label: "Messages", component: <AdminContactManager /> },
  { key: "orders", label: "Commandes", component: <AdminOrderManager /> },
  { key: "reminders", label: "Rappels", component: <AdminReminderManager /> },
  { key: "users", label: "Utilisateurs", component: <AdminUserManager /> },
  { key: "stocks", label: "Stocks", component: <AdminStockManager /> },
  { key: "results", label: "Résultats", component: <AdminDashboardOverview /> },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("plants");

  const currentTab = TABS.find((tab) => tab.key === activeTab);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Admin</h1>

      <div className={styles.tabContainer}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`${styles.tabButton} ${
              activeTab === tab.key ? styles.tabActive : styles.tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {currentTab?.component || <p>Onglet inconnu</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
