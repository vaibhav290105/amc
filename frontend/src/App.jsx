import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AssetForm from './pages/AssetForm';
import AMCForm from './pages/AMCForm';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          {/* General Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Technician-only route */}
          {role === 'TECHNICIAN' && (
            <Route path="/technician" element={<TechnicianDashboard />} />
          )}

          {/* Asset manager & admin routes */}
          {(role === 'ADMIN' || role === 'ASSET_MANAGER') && (
            <>
              <Route path="/asset/add" element={<AssetForm />} />
              <Route path="/asset/edit/:assetId" element={<AssetForm />} />
              <Route path="/asset/:assetId/amc" element={<AMCForm />} />
            </>
          )}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<h1 className="p-10 text-2xl">404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
