import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  role: string;
}

interface Software {
  id: number;
  name: string;
  description: string;
  accessLevel: "Read" | "Write" | "Admin";
}

interface Request {
  id: number;
  accessType: string;
  reason: string;
  status: string; // "Pending", "Approved", "Declined", etc.
  user: User;
  software: Software;
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

const approveButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  marginRight: "0.5rem",
  backgroundColor: "#e0f3ff",
  color: "#0077b6",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const declineButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#ffe0e0",
  color: "#d00000",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
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

const RequestsTable: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get<Request[]>(
          "http://localhost:3001/api/requests"
        );
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const updateRequestStatus = async (
    requestId: number,
    newStatus: "Approved" | "Declined"
  ) => {
    try {
      await axios.put(`http://localhost:3001/api/requests/${requestId}`, {
        status: newStatus,
      });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error("Failed to update request status", err);
      alert("Error updating status");
    }
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const approvedRequests = requests.filter((r) => r.status === "Approved");

  return (
    <div>
      {/* Pending Requests Table */}
      <h2>Pending Requests</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>ID</th>
              <th style={headerStyle}>Username</th>
              <th style={headerStyle}>User Role</th>
              <th style={headerStyle}>Software</th>
              <th style={headerStyle}>Access Type</th>
              <th style={headerStyle}>Reason</th>
              <th style={headerStyle}>Status</th>
              <th style={headerStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(
              ({ id, user, software, accessType, reason, status }, index) => (
                <tr key={id} style={index % 2 === 0 ? rowStyle : undefined}>
                  <td style={cellStyle}>{id}</td>
                  <td style={cellStyle}>{user.username}</td>
                  <td style={cellStyle}>{user.role}</td>
                  <td style={cellStyle}>{software.name}</td>
                  <td style={cellStyle}>{accessType}</td>
                  <td style={cellStyle}>{reason}</td>
                  <td style={cellStyle}>{status}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => updateRequestStatus(id, "Approved")}
                      style={approveButtonStyle}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateRequestStatus(id, "Declined")}
                      style={declineButtonStyle}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      {/* Approved Requests Table */}
      <h2 style={{ marginTop: "2rem" }}>Approved Requests</h2>
      {approvedRequests.length === 0 ? (
        <p>No approved requests.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>ID</th>
              <th style={headerStyle}>Username</th>
              <th style={headerStyle}>User Role</th>
              <th style={headerStyle}>Software</th>
              <th style={headerStyle}>Access Type</th>
              <th style={headerStyle}>Reason</th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map(
              ({ id, user, software, accessType, reason, status }, index) => (
                <tr key={id} style={index % 2 === 0 ? rowStyle : undefined}>
                  <td style={cellStyle}>{id}</td>
                  <td style={cellStyle}>{user.username}</td>
                  <td style={cellStyle}>{user.role}</td>
                  <td style={cellStyle}>{software.name}</td>
                  <td style={cellStyle}>{accessType}</td>
                  <td style={cellStyle}>{reason}</td>
                  <td style={cellStyle}>{status}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsTable;
