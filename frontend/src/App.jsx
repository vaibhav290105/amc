import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register'; // <-- NEW IMPORT
import Dashboard from './pages/Dashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AssetForm from './pages/AssetForm';
import AMCForm from './pages/AMCForm';
import PrivateRoute from './routes/PrivateRoute';
import AMCDetails from './pages/AMCDetails';

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-10 text-xl">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- NEW ROUTE */}

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Technician-only */}
          <Route path="/technician" element={<PrivateRoute allowedRoles={['TECHNICIAN']}><TechnicianDashboard /></PrivateRoute>} />


          {/* Admin & Asset Manager */}
          {(role === 'ADMIN' || role === 'ASSET_MANAGER') && (
            <>
              <Route path="/add-asset" element={<AssetForm />} />
              <Route path="/edit-asset/:assetId" element={<AssetForm />} />
              <Route path="/asset/:assetId/amc-create" element={<AMCForm />} />
              <Route path="/asset/:assetId/amc-details" element={<AMCDetails />} />
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
