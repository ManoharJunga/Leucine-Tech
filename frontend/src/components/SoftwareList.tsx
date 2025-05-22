import React from "react";
import type { Software } from "../api/software";
import { deleteSoftware } from "../api/software";

interface SoftwareListProps {
  softwares: Software[];
  onEdit: (software: Software) => void;
  onRefresh: () => void;
}

const SoftwareList: React.FC<SoftwareListProps> = ({ softwares, onEdit, onRefresh }) => {
  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this software?")) return;

    try {
      await deleteSoftware(id);
      onRefresh();
    } catch (error) {
      alert("Failed to delete software");
      console.error(error);
    }
  };

  if (softwares.length === 0) {
    return <p style={{ padding: "1rem", textAlign: "center", color: "#666" }}>No software found.</p>;
  }

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
      }}>
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Description</th>
            <th style={headerStyle}>Access Levels</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {softwares.map(({ id, name, description, accessLevels }) => (
            <tr key={id} style={rowStyle}>
              <td style={cellStyle}>{name}</td>
              <td style={cellStyle}>{description}</td>
              <td style={cellStyle}>{accessLevels}</td>
              <td style={cellStyle}>
                <button style={editButtonStyle} onClick={() => onEdit({ id, name, description, accessLevels })}>
                  Edit
                </button>
                <button style={deleteButtonStyle} onClick={() => handleDelete(id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Styling ---
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

const editButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  marginRight: "0.5rem",
  backgroundColor: "#e0f3ff",
  color: "#0077b6",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#ffe0e0",
  color: "#d00000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default SoftwareList;
