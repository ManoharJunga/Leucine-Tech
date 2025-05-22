import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RequestAccessForm from "../../components/RequestAccessForm";
import { fetchSoftwares } from "../../api/software";
import type { Software } from "../../api/software";

const RequestAccessFormPage: React.FC = () => {
  const { id } = useParams();
  const [software, setSoftware] = useState<Software | null>(null);

  useEffect(() => {
    const loadSoftware = async () => {
      try {
        const data = await fetchSoftwares();
        const softwareId = id ? Number(id) : null;
        const found = data.find((s) => s.id === softwareId);
        setSoftware(found || null);
      } catch (err) {
        alert("Failed to load software details");
      }
    };

    loadSoftware();
  }, [id]);

  if (!software) {
    return (
      <div
        style={{
          backgroundColor: "#fff7f0",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          color: "#5c4033",
        }}
      >
        Loading software details...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "3rem",
        backgroundColor: "#fff7f0",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff0e0",
          border: "1px solid #ffddb3",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 8px 16px rgba(255, 140, 66, 0.2)",
        }}
      >
        <h2 style={{ color: "#3d2c1e", marginBottom: "1.5rem" }}>
          Request Access for <span style={{ color: "#ff8c42" }}>{software.name}</span>
        </h2>

        <RequestAccessForm
          software={software}
          onSuccess={() => window.history.back()}
          onCancel={() => window.history.back()}
        />
      </div>
    </div>
  );
};

export default RequestAccessFormPage;
