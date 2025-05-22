import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
interface Request {
  id: number;
  accessType: string;
  reason: string;
  status: string;
  user: {
    id: number;
    username: string;
  };
  software: {
    name: string;
    description: string;
    accessLevel: string;
  };
}

const UserRequestTable: React.FC = () => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id;

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/requests');
        // filter requests made by current employee
        const employeeRequests = response.data.filter(
          (req: Request) => req.user.id === userId
        );
        setRequests(employeeRequests);
      } catch (error) {
        console.error('Error fetching access requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Access Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Access Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>User</th>
              <th>Software</th>
              <th>Access Level</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.accessType}</td>
                <td>{req.reason}</td>
                <td>{req.status}</td>
                <td>{req.user.username}</td>
                <td>{req.software.name}</td>
                <td>{req.software.accessLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '2rem',
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '0.8rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '1rem',
    color: '#333',
    fontSize: '1.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    backgroundColor: '#f0f0f0',
    padding: '0.75rem',
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #ddd',
  },
};

export default UserRequestTable;
