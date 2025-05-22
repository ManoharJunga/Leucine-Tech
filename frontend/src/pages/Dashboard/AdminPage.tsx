import React, { useState, useEffect } from "react";
import { fetchSoftwares } from "../../api/software";
import type { Software } from "../../api/software";
import SoftwareList from "../../components/SoftwareList";
import SoftwareForm from "../../components/SoftwareForm";
import AdminDashboard from "../../components/AdminDashboard";
import { useAuth } from "../../context/AuthContext";
import RequestsTable from "../../components/RequestsTable";
import UserTables from "../../components/UserTables";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard" },
  { key: "softwares", label: "Manage Softwares" },
  { key: "requests", label: "View Requests" },
  { key: "users", label: "Manage Users" },
];

type TabKey = typeof sidebarItems[number]["key"];

const AdminPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [softwares, setSoftwares] = useState<Software[]>([]);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const loadSoftwares = async () => {
    try {
      const data = await fetchSoftwares();
      setSoftwares(data);
    } catch (error) {
      alert("Failed to load softwares");
      console.error(error);
    }
  };
  const handleLogout = () => {
    logout();         // Clear auth state
    navigate("/"); // Redirect
  };

  useEffect(() => {
    loadSoftwares();
  }, []);

  const handleEdit = (software: Software) => {
    setEditingSoftware(software);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingSoftware(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    loadSoftwares();
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
        <h2 style={{ color: "#ffe7d0", fontSize: "1.5rem", marginBottom: "1rem" }}>Admin Panel</h2>

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
            {activeTab === "softwares"
              ? "Manage Softwares"
              : sidebarItems.find((item) => item.key === activeTab)?.label || "Dashboard"}
          </h1>
        </header>

        {activeTab === "softwares" && (
          <>
            {showForm ? (
              <SoftwareForm
                softwareToEdit={editingSoftware || undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <>
                <button
                  onClick={handleCreate}
                  style={{
                    marginBottom: "1.5rem",
                    padding: "0.6rem 1.2rem",
                    backgroundColor: "#ff8c42",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e6762e")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff8c42")}
                >
                  + Add New Software
                </button>
                <SoftwareList softwares={softwares} onEdit={handleEdit} onRefresh={loadSoftwares} />
              </>
            )}
          </>
        )}

        {activeTab === "dashboard" && <AdminDashboard />}
        {activeTab === "requests" && <RequestsTable />}
        {activeTab === "users" && <UserTables />}
      </main>
    </div>
  );
};

export default AdminPage;
