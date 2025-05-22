import React, { useState } from "react";
import AdminDashboard from "../../components/AdminDashboard";
import { useAuth } from "../../context/AuthContext";
import RequestsTable from "../../components/RequestsTable";
import UserTables from "../../components/UserTables";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "requests", label: "View Requests" },
  { key: "users", label: "Manage Users" },
];

type TabKey = typeof sidebarItems[number]["key"];

const ManagerPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const handleLogout = () => {
    logout();         // Clear auth state
    navigate("/"); // Redirect
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#fff7f0" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          backgroundColor: "#5a2a27",
          color: "white",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <h2 style={{ color: "#ffe7d0", fontSize: "1.5rem", marginBottom: "1rem" }}>Manager Panel</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {sidebarItems.map(({ key, label }) => (
            <li
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: "0.75rem 0",
                cursor: "pointer",
                color: activeTab === key ? "#ff8c42" : "#fff",
                fontWeight: activeTab === key ? "bold" : "normal",
              }}
            >
              {label}
            </li>
          ))}

          <li
            onClick={handleLogout}
            style={{
              padding: "0.75rem 0",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ color: "#3d2c1e", fontSize: "1.8rem", marginBottom: "0.5rem" }}>
            {sidebarItems.find((item) => item.key === activeTab)?.label || "Dashboard"}
          </h1>
        </header>

        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "requests" && <RequestsTable />}
        {activeTab === "users" && <UserTables />}
      </main>
    </div>
  );
};

export default ManagerPage;
