import React, { useState } from "react";
import MyReminders from "./MyReminders";
import OrderHistory from "../cart/OrderHistory"; 
import UserProfile from "./UserProfile"; 
import styles from "../../styles/UserDashboard.module.css";


const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("reminders");

  
const renderContent = () => {
  if (activeTab === "reminders") return <MyReminders />;
  if (activeTab === "orders") return <OrderHistory />;
  if (activeTab === "profile") return <UserProfile />; 
  return null;
};
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mon espace</h1>

        <div className={styles.tabContainer}>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`${styles.tabButton} ${
              activeTab === "reminders" ? styles.tabActive : styles.tabInactive
            }`}
          >
            Mes rappels
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`${styles.tabButton} ${
              activeTab === "orders" ? styles.tabActive : styles.tabInactive
            }`}
          >
            Historique des commandes
          </button>
          <button
          onClick={() => setActiveTab("profile")}
          className={`${styles.tabButton} ${
            activeTab === "profile" ? styles.tabActive : styles.tabInactive
          }`}
        >
          Mon profil
        </button>
        </div>


        <div className={styles.tabContent}>{renderContent()}</div>
      </div>
    </>
  );
};

export default UserDashboard;
