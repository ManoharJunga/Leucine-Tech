import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/LoginPage';
import Signup from './pages/Auth/SignupPage';
import UserPage from './pages/Dashboard/UserPage';
import ManagerPage from './pages/Dashboard/ManagerPage';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/Dashboard/AdminPage';
import SoftwareListPage from './pages/Software/SoftwareListPage';
import RequestAccessFormPage from "./pages/software/RequestAccessFormPage"; // New page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-dashboard" element={<UserPage />} />
          <Route path="/manager-dashboard" element={<ManagerPage />} />
          <Route path='/admin-dashboard' element={<AdminPage /> } />
          <Route path='/software' element={<SoftwareListPage />} />
          <Route path="/request-access/:id" element={<RequestAccessFormPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
