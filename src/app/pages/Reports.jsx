import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getStats, getDepartments, getComplaints } from '../../api';
import { useLanguage } from '../../context/LanguageContext';

const Reports = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
    Promise.all([getDepartments(), getComplaints()]).then(([depts, complaints]) => {
      setDepartmentData(depts.map((dept) => ({
        name: dept.code,
        complaints: complaints.filter((c) => c.department?.name === dept.name).length,
      })));
    }).catch(console.error);
  }, []);

  if (!stats) return <div className="p-6 text-gray-500">Loading reports...</div>;

  const statusData = [
    { name: t('pending'), value: stats.pending_complaints, color: '#0f766e' },
    { name: t('inProgress'), value: stats.in_progress_complaints, color: '#0d9488' },
    { name: t('adminResolved'), value: stats.resolved_complaints, color: '#14b8a6' },
  ];

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl text-gray-800 mb-4 md:mb-6">{t('adminReportsAnalytics')}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mb-4 md:mb-8">
        <div className="bg-[#0f766e] rounded-xl p-3 md:p-6 text-white shadow-lg"><p className="text-xs md:text-sm opacity-90 mb-1">{t('adminTotal')}</p><h3 className="text-xl md:text-4xl">{stats.total_complaints}</h3></div>
        <div className="bg-[#0f766e] rounded-xl p-3 md:p-6 text-white shadow-lg"><p className="text-xs md:text-sm opacity-90 mb-1">{t('pending')}</p><h3 className="text-xl md:text-4xl">{stats.pending_complaints}</h3></div>
        <div className="bg-[#0f766e] rounded-xl p-3 md:p-6 text-white shadow-lg"><p className="text-xs md:text-sm opacity-90 mb-1">{t('inProgress')}</p><h3 className="text-xl md:text-4xl">{stats.in_progress_complaints}</h3></div>
        <div className="bg-[#0f766e] rounded-xl p-3 md:p-6 text-white shadow-lg"><p className="text-xs md:text-sm opacity-90 mb-1">{t('adminResolved')}</p><h3 className="text-xl md:text-4xl">{stats.resolved_complaints}</h3></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg md:text-xl text-gray-800 mb-3 md:mb-4">{t('adminStatusDistribution')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg md:text-xl text-gray-800 mb-3 md:mb-4">{t('adminDepartmentWiseComplaints')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="complaints" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-3 md:mt-6 bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg md:text-xl text-gray-800 mb-3 md:mb-4">{t('adminPerformanceMetrics')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('adminResolutionRate')}</p>
            <p className="text-2xl md:text-3xl text-[#0f766e]">
              {stats.total_complaints > 0 ? ((stats.resolved_complaints / stats.total_complaints) * 100).toFixed(1) : 0}%
            </p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0f766e]" style={{ width: `${stats.total_complaints > 0 ? (stats.resolved_complaints / stats.total_complaints) * 100 : 0}%` }} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('adminAvgResponseTime')}</p>
            <p className="text-2xl md:text-3xl text-[#0f766e]">{t('adminAvgResponseValue')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('adminBasedOnRecentComplaints')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('adminCitizenSatisfaction')}</p>
            <p className="text-2xl md:text-3xl text-[#0f766e]">87%</p>
            <p className="text-xs text-gray-500 mt-1">{t('adminFromFeedbackSurveys')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
