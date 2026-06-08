import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Building2, Users, BarChart3 } from 'lucide-react';

import Header from './components/Header';
import { useLanguage } from '../context/LanguageContext';

import AdminDashboard from './pages/AdminDashboard';
import ManageComplaints from './pages/ManageComplaints';
import Departments from './pages/Departments';
import Officers from './pages/Officers';
import Reports from './pages/Reports';

const App = () => {
  const { t } = useLanguage();
  const [userRole, setUserRole] = useState(
    () => (sessionStorage.getItem('tn_admin_authenticated') === '1' ? 'admin' : null)
  );

  const SettingsPage = () => (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl text-gray-800 mb-4 md:mb-6">{t('adminSettings')}</h2>
      <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
        <p className="text-gray-700">{t('adminSettingsPlaceholder')}</p>
      </div>
    </div>
  );

  const menuItems = [
    { path: '/admin/dashboard', label: t('adminMenuDashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/complaints', label: t('adminMenuComplaints'), icon: <FileText className="w-5 h-5" /> },
    { path: '/admin/departments', label: t('adminMenuDepartments'), icon: <Building2 className="w-5 h-5" /> },
    { path: '/admin/officers', label: t('adminMenuOfficers'), icon: <Users className="w-5 h-5" /> },
    { path: '/admin/reports', label: t('adminMenuReports'), icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('tn_admin_authenticated');
    setUserRole(null);
  };

  if (!userRole) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userRole={userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
        onLogout={handleLogout}
        menuItems={menuItems}
      />

      <Routes>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="complaints" element={<ManageComplaints />} />
        <Route path="departments" element={<Departments />} />
        <Route path="officers" element={<Officers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </div>
  );
};

export default App;
