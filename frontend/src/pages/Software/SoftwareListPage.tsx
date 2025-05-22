import React, { useEffect, useState } from "react";
import { fetchSoftwares } from "../../api/software";
import type { Software } from "../../api/software";
import RequestAccessForm from "../../components/RequestAccessForm";
import { useNavigate } from "react-router-dom";

const SoftwareListPage: React.FC = () => {
    const navigate = useNavigate();

    const [softwares, setSoftwares] = useState<Software[]>([]);
    const [search, setSearch] = useState("");
    const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);

    useEffect(() => {
        const loadSoftwares = async () => {
            try {
                const data = await fetchSoftwares();
                setSoftwares(data);
            } catch (err) {
                alert("Failed to fetch softwares");
            }
        };
        loadSoftwares();
    }, []);

    const filteredSoftwares = softwares.filter((sw) =>
        sw.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: "2rem", backgroundColor: "#fff7f0", minHeight: "100vh" }}>
            <h2 style={{ color: "#3d2c1e", marginBottom: "1.5rem" }}>Available Softwares</h2>

            <input
                type="text"
                placeholder="Search software..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    padding: "0.75rem 1rem",
                    marginBottom: "2rem",
                    width: "100%",
                    borderRadius: "8px",
                    border: "1px solid #ffddb3",
                    backgroundColor: "#fff0e0",
                    fontSize: "1rem",
                }}
            />

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                }}
            >
                {filteredSoftwares.map((sw) => (
                    <div
                        key={sw.id}
                        style={{
                            border: "1px solid #ffddb3",
                            borderRadius: "12px",
                            padding: "1rem",
                            width: "250px",
                            boxShadow: "0 4px 8px rgba(255, 140, 66, 0.2)",
                            backgroundColor: "#fff0e0",
                            transition: "transform 0.2s",
                        }}
                    >
                        <h4 style={{ color: "#3d2c1e", marginBottom: "0.5rem" }}>{sw.name}</h4>
                        <p style={{ color: "#5c4033", fontSize: "0.9rem" }}>
                            {sw.description || "No description available."}
                        </p>
                        <button
                            onClick={() => navigate(`/request-access/${sw.id}`)}
                            style={{
                                marginTop: "1rem",
                                padding: "0.5rem 1rem",
                                backgroundColor: "#ff8c42",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            Request Access
                        </button>
                    </div>
                ))}
            </div>

            {selectedSoftware && (
                <div style={{ marginTop: "3rem" }}>
                    <RequestAccessForm
                        software={selectedSoftware}
                        onSuccess={() => setSelectedSoftware(null)}
                        onCancel={() => setSelectedSoftware(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default SoftwareListPage;
