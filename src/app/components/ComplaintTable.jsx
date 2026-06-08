import { useState } from 'react';
import { Search, Filter, Eye, UserPlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ComplaintTable = ({ complaints, onViewDetails, onAssign, showAssignButton = false }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#f0fdfa] text-[#0f766e] border-[#0f766e]';
      case 'In Progress':
        return 'bg-[#f0fdfa] text-[#0f766e] border-[#0f766e]';
      case 'Resolved':
        return 'bg-[#f0fdfa] text-[#0f766e] border-[#0f766e]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || complaint.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const uniqueDepartments = [...new Set(complaints.map(c => c.department))];
  const getStatusLabel = (status) => {
    if (status === 'Pending') return t('pending');
    if (status === 'In Progress') return t('inProgress');
    if (status === 'Resolved') return t('adminResolved');
    return status;
  };

  return (
    <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
      {/* Search and Filters */}
      <div className="mb-4 md:mb-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white appearance-none text-sm md:text-base"
          >
            <option value="All">{t('adminAllStatus')}</option>
            <option value="Pending">{t('pending')}</option>
            <option value="In Progress">{t('inProgress')}</option>
            <option value="Resolved">{t('adminResolved')}</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Filter className="absolute left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full pl-8 md:pl-10 pr-2 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white appearance-none text-sm md:text-base"
          >
            <option value="All">{t('adminAllDepartments')}</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0f766e] text-white">
              <th className="px-2 md:px-4 py-2 md:py-3 text-left rounded-tl-lg text-xs md:text-sm">ID</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm hidden sm:table-cell">{t('adminCitizen')}</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm hidden md:table-cell">{t('department')}</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm">{t('subject')}</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm">{t('currentStatus')}</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm hidden lg:table-cell">{t('adminDate')}</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-center rounded-tr-lg text-xs md:text-sm">{t('adminActions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint, index) => (
              <tr
                key={complaint.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm">{complaint.id}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden sm:table-cell">{complaint.citizenName}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden md:table-cell">{complaint.department}</td>
                <td className="px-2 md:px-4 py-2 md:py-3 max-w-[100px] md:max-w-xs truncate text-xs md:text-sm">{complaint.title}</td>
                <td className="px-2 md:px-4 py-2 md:py-3">
                  <span className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs border ${getStatusColor(complaint.status)}`}>
                    {getStatusLabel(complaint.status)}
                  </span>
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden lg:table-cell">{complaint.dateSubmitted}</td>
                <td className="px-2 md:px-4 py-2 md:py-3">
                  <div className="flex items-center justify-center gap-1 md:gap-2">
                    <button
                      onClick={() => onViewDetails(complaint)}
                      className="p-1 md:p-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] transition-colors"
                      title={t('adminViewDetails')}
                    >
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    {showAssignButton && !complaint.assignedOfficer && (
                      <button
                        onClick={() => onAssign(complaint)}
                        className="p-1 md:p-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] transition-colors"
                        title={t('adminAssign')}
                      >
                        <UserPlus className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <p className="text-sm md:text-base">{t('adminNoComplaintsMatch')}</p>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
        {t('adminShowingResults')
          .replace('{shown}', filteredComplaints.length)
          .replace('{total}', complaints.length)}
      </div>
    </div>
  );
};

export default ComplaintTable;
