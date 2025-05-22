import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Software } from "../api/software";

type Props = {
  software: Software;
  onSuccess: () => void;
  onCancel: () => void;
};

const RequestAccessForm: React.FC<Props> = ({ software, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [accessType, setAccessType] = useState<"Read" | "Write" | "Admin">("Read");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert("Please provide a reason");
      return;
    }

    if (!user?.id) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const requestBody = {
      userId: user.id,
      softwareId: software.id,
      accessType,
      reason,
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Error: " + (errData.message || "Failed to submit request"));
      } else {
        alert("Request submitted successfully");
        onSuccess();
      }
    } catch (err) {
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
      }}
    >
      <div>
        <label
          htmlFor="accessType"
          style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#3d2c1e" }}
        >
          Access Type:
        </label>
        <select
          id="accessType"
          value={accessType}
          onChange={(e) => setAccessType(e.target.value as "Read" | "Write" | "Admin")}
          required
          style={{
            width: "100%",
            padding: "0.6rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          <option value="Read">Read</option>
          <option value="Write">Write</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="reason"
          style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#3d2c1e" }}
        >
          Reason:
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={4}
          placeholder="Explain why you need access"
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
            fontFamily: "inherit",
            backgroundColor: "#fff",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#e0e0e0",
            border: "none",
            borderRadius: "8px",
            color: "#333",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.6rem 1.4rem",
            backgroundColor: "#ff8c42",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
};

export default RequestAccessForm;
