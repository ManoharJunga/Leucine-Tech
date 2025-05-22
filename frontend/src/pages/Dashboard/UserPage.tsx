import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SoftwareListPage from '../Software/SoftwareListPage';
import UserRequestTable from '../../components/UserRequestTable';

const UserPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('search');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'search':
        return (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Search Software</h2>
            <SoftwareListPage />
          </section>
        );
      case 'history':
        return (
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Your Access Requests History</h2>
            <UserRequestTable />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>User Dashboard</h2>
        <ul style={styles.navList}>
          <li
            style={{
              ...styles.navItem,
              fontWeight: activeSection === 'search' ? 'bold' : 'normal',
            }}
            onClick={() => setActiveSection('search')}
          >
            Search Software
          </li>
         
          <li
            style={{
              ...styles.navItem,
              fontWeight: activeSection === 'history' ? 'bold' : 'normal',
            }}
            onClick={() => setActiveSection('history')}
          >
            Your Access Requests History
          </li>
        </ul>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <h1 style={styles.welcome}>
          Welcome back, <span style={styles.username}>{user?.username}</span>!
        </h1>
        <p style={styles.role}>
          Your role: <strong>{user?.role}</strong>
        </p>
        {renderContent()}
      </main>
    </div>
  );
};

const styles = {
  dashboard: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#fdfaf6',
    fontFamily: 'Segoe UI, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#fff3e0',
    padding: '1.5rem',
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    color: '#f57c00',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '2rem',
  },
  navItem: {
    marginBottom: '1rem',
    cursor: 'pointer',
    color: '#444',
    transition: 'all 0.3s',
  },
  logoutButton: {
    backgroundColor: '#f57c00',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.4rem',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#fffaf2',
    overflowY: 'auto',
  },
  welcome: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  username: {
    color: '#ef6c00',
  },
  role: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    marginBottom: '1rem',
    color: '#333',
  },
};

export default UserPage;
