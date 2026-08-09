import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import AdminLayout from '../layouts/AdminLayout';
import PublicLayout from '../layouts/PublicLayout';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Sectors from '../pages/public/Sectors';
import SectorDetails from '../pages/public/SectorDetails';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import NotFound from '../pages/public/NotFound';

// Admin Pages
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const SectorManagement = lazy(() => import('../pages/admin/sectors/SectorManagement'));
const CityInformationManagement = lazy(() => import('../pages/admin/city/CityInformationManagement'));
const MessageManagement = lazy(() => import('../pages/admin/messages/MessageManagement'));
const AuditLogs = lazy(() => import('../pages/admin/audit/AuditLogs'));
const Profile = lazy(() => import('../pages/admin/profile/Profile'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading Secure Gateway...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Interface...</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sectors" element={<Sectors />} />
          <Route path="/sectors/:id" element={<SectorDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'DepartmentAdmin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="sectors" element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'DepartmentAdmin']}>
              <SectorManagement />
            </ProtectedRoute>
          } />
          
          <Route path="city-info" element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'DepartmentAdmin']}>
              <CityInformationManagement />
            </ProtectedRoute>
          } />

          <Route path="messages" element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'DepartmentAdmin']}>
              <MessageManagement />
            </ProtectedRoute>
          } />
          
          <Route path="profile" element={
            <ProtectedRoute allowedRoles={['SuperAdmin', 'DepartmentAdmin']}>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="audit-logs" element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <AuditLogs />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="/unauthorized" element={<div className="p-8 text-center text-red-500 font-bold">403 - Forbidden</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
