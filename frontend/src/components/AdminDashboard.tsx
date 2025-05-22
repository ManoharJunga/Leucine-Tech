import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    Typography,
    CircularProgress
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MemoryIcon from "@mui/icons-material/Memory";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

const styles = {
    background: "#ffffff",
    cardBackground: "#ffffff",
    textPrimary: "#333333",
    iconColor: "#ff8c42",
    borderColor: "#e0e0e0"
};

const StatCard = ({ title, count, Icon }: { title: string; count: number; Icon: React.ElementType }) => (
    <Card
        sx={{
            width: 240,
            height: 120,
            borderRadius: 2,
            border: `1px solid ${styles.borderColor}`,
            backgroundColor: styles.cardBackground,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 2,
            boxShadow: "none"
        }}
    >
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={14} fontWeight={500} color={styles.textPrimary}>
                {title}
            </Typography>
            <Icon sx={{ fontSize: 30, color: styles.iconColor }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" color={styles.textPrimary}>
            {count}
        </Typography>
    </Card>
);

function AdminDashboard() {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [managerCount, setManagerCount] = useState(0);
    const [softwareCount, setSoftwareCount] = useState(0);
    const [pendingRequestCount, setPendingRequestCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [employeesRes, managersRes, softwareRes, requestsRes] = await Promise.all([
                    axios.get("http://localhost:3001/api/users/employees"),
                    axios.get("http://localhost:3001/api/users/managers"),
                    axios.get("http://localhost:3001/api/software"),
                    axios.get("http://localhost:3001/api/requests")
                ]);

                setEmployeeCount(employeesRes.data.length);
                setManagerCount(managersRes.data.length);
                setSoftwareCount(softwareRes.data.length);
                const pending = requestsRes.data.filter((r: any) => r.status === "Pending");
                setPendingRequestCount(pending.length);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching counts:", err);
                setError("Failed to fetch counts");
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor={styles.background}>
                <CircularProgress sx={{ color: styles.iconColor }} />
            </Box>
        );

    if (error)
        return (
            <Typography color="error" textAlign="center" mt={4}>
                {error}
            </Typography>
        );

    return (
        <Box bgcolor={styles.background} minHeight="100vh" p={4}>
            <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
                <StatCard title="Employees" count={employeeCount} Icon={PeopleIcon} />
                <StatCard title="Managers" count={managerCount} Icon={SupervisorAccountIcon} />
                <StatCard title="Softwares" count={softwareCount} Icon={MemoryIcon} />
                <StatCard title="Pending Requests" count={pendingRequestCount} Icon={HourglassTopIcon} />
            </Box>
        </Box>
    );
}

export default AdminDashboard;
