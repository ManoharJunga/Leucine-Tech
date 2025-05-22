import React, { useState } from "react";
import type { Software } from "../api/software";
import { createSoftware, updateSoftware } from "../api/software";

interface SoftwareFormProps {
  softwareToEdit?: Software;
  onSuccess: () => void;
  onCancel: () => void;
}

const ACCESS_LEVELS = ["Read", "Write", "Admin"] as const;

const SoftwareForm: React.FC<SoftwareFormProps> = ({
  softwareToEdit,
  onSuccess,
  onCancel,
}) => {
  const [name, setName] = useState(softwareToEdit?.name || "");
  const [description, setDescription] = useState(softwareToEdit?.description || "");
  const [accessLevels, setAccessLevels] = useState<Software["accessLevels"]>(
    softwareToEdit?.accessLevels || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      alert("Name and description are required");
      return;
    }

    if (accessLevels.length === 0) {
      alert("Select at least one access level");
      return;
    }

    try {
      const payload: Software = { name, description, accessLevels };

      if (softwareToEdit?.id) {
        await updateSoftware(softwareToEdit.id, payload);
      } else {
        await createSoftware(payload);
      }

      onSuccess();
    } catch (error) {
      alert("Error saving software");
      console.error(error);
    }
  };

  const toggleAccessLevel = (level: Software["accessLevels"][number]) => {
    setAccessLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headingStyle}>{softwareToEdit ? "Edit Software" : "Create Software"}</h2>

      <div style={fieldStyle}>
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Access Levels</label>
        <div>
          {ACCESS_LEVELS.map((level) => (
            <label key={level} style={radioLabelStyle}>
              <input
                type="checkbox"
                value={level}
                checked={accessLevels.includes(level)}
                onChange={() => toggleAccessLevel(level)}
              />
              <span style={{ marginLeft: "0.4rem" }}>{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button type="submit" style={primaryButton}>
          {softwareToEdit ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onCancel} style={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Styles
const formStyle: React.CSSProperties = {
  maxWidth: "500px",
  margin: "0 auto",
  backgroundColor: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const headingStyle: React.CSSProperties = {
  marginBottom: "1rem",
  color: "#333",
};

const fieldStyle: React.CSSProperties = {
  marginBottom: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.5rem",
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const radioLabelStyle: React.CSSProperties = {
  marginRight: "1rem",
  fontSize: "0.95rem",
};

const primaryButton: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#0077b6",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#eee",
  color: "#333",
  border: "none",
  borderRadius: "4px",
  marginLeft: "1rem",
  cursor: "pointer",
};

export default SoftwareForm;
