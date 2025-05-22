import React, { useState, useEffect } from "react";
import { fetchEmployees, fetchManagers } from "../api/software"; // Adjust path as needed

interface User {
  id: number;
  username: string;
  role: string;
}

const headerStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#444",
  borderBottom: "1px solid #ddd",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  color: "#333",
};

const rowStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  marginTop: "1rem",
};

const UserTables: React.FC = () => {
  const [selectedView, setSelectedView] = useState<"employee" | "manager">("employee");
  const [employees, setEmployees] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setError(null);
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const loadManagers = async () => {
    try {
      setLoading(true);
      const data = await fetchManagers();
      setManagers(data);
      setError(null);
    } catch {
      setError("Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadManagers();
  }, []);

  return (
    <div>
      {/* Toggle Buttons */}
      <div
        style={{
          display: "flex",
          marginBottom: "1.5rem",
          position: "relative",
          width: 300,
          borderRadius: 8,
          backgroundColor: "#eee",
        }}
      >
        <button
          onClick={() => setSelectedView("employee")}
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            backgroundColor: selectedView === "employee" ? "#ff8c42" : "transparent",
            color: selectedView === "employee" ? "#fff" : "#333",
            border: "none",
            borderRadius: "8px 0 0 8px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
            zIndex: 2,
            position: "relative",
          }}
        >
          Employees
        </button>
        <button
          onClick={() => setSelectedView("manager")}
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            backgroundColor: selectedView === "manager" ? "#ff8c42" : "transparent",
            color: selectedView === "manager" ? "#fff" : "#333",
            border: "none",
            borderRadius: "0 8px 8px 0",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
            zIndex: 2,
            position: "relative",
          }}
        >
          Managers
        </button>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: selectedView === "employee" ? 0 : "50%",
            width: "50%",
            height: "100%",
            backgroundColor: "#ff8c42",
            borderRadius: 8,
            transition: "left 0.3s",
            zIndex: 1,
          }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Tables */}
      {selectedView === "employee" && !loading && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Username</th>
              <th style={headerStyle}>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.id} style={idx % 2 === 0 ? rowStyle : undefined}>
                <td style={cellStyle}>{emp.username}</td>
                <td style={cellStyle}>{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedView === "manager" && !loading && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Username</th>
              <th style={headerStyle}>Role</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((mgr, idx) => (
              <tr key={mgr.id} style={idx % 2 === 0 ? rowStyle : undefined}>
                <td style={cellStyle}>{mgr.username}</td>
                <td style={cellStyle}>{mgr.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTables;
