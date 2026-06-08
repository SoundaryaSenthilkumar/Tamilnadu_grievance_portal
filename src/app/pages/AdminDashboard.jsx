import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Building2, Users } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { getStats, getComplaints } from '../../api';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
    getComplaints().then((data) => setRecentComplaints(data.slice(0, 5))).catch(console.error);
  }, []);

  const getStatusLabel = (status) => {
    if (status === 'Pending') return t('pending');
    if (status === 'In Progress') return t('inProgress');
    if (status === 'Resolved') return t('completed');
    return status;
  };

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl text-gray-800 mb-4 md:mb-6">{t('adminDashboardTitle')}</h2>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          <DashboardCard title={t('adminTotalComplaints')} value={stats.total_complaints} icon={<FileText className="w-6 h-6 md:w-8 md:h-8" />} color="blue" subtitle={t('adminTotalComplaintsSub')} />
          <DashboardCard title={t('pending')} value={stats.pending_complaints} icon={<AlertCircle className="w-6 h-6 md:w-8 md:h-8" />} color="yellow" subtitle={t('adminPendingSub')} />
          <DashboardCard title={t('inProgress')} value={stats.in_progress_complaints} icon={<Clock className="w-6 h-6 md:w-8 md:h-8" />} color="purple" subtitle={t('adminInProgressSub')} />
          <DashboardCard title={t('adminResolved')} value={stats.resolved_complaints} icon={<CheckCircle className="w-6 h-6 md:w-8 md:h-8" />} color="green" subtitle={t('adminResolvedSub')} />
          <DashboardCard title={t('adminMenuDepartments')} value={stats.departments_count} icon={<Building2 className="w-6 h-6 md:w-8 md:h-8" />} color="indigo" subtitle={t('adminDepartmentsSub')} />
          <DashboardCard title={t('adminMenuOfficers')} value={stats.officers_count} icon={<Users className="w-6 h-6 md:w-8 md:h-8" />} color="red" subtitle={t('adminOfficersSub')} />
        </div>
      )}

      <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg md:text-xl text-gray-800 mb-3 md:mb-4">{t('adminRecentComplaints')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-gray-700 text-sm">ID</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-gray-700 text-sm">{t('adminCitizen')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-gray-700 text-sm hidden sm:table-cell">{t('department')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-gray-700 text-sm">{t('currentStatus')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-gray-700 text-sm hidden md:table-cell">{t('adminDate')}</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((complaint, index) => (
                <tr key={complaint.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-[#0f766e] text-sm">{complaint.token}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-sm">{complaint.citizen_name}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden sm:table-cell">{complaint.department?.name}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs bg-[#f0fdfa] text-[#0f766e]">
                      {getStatusLabel(complaint.status)}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden md:table-cell">
                    {complaint.submitted_at?.split('T')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
