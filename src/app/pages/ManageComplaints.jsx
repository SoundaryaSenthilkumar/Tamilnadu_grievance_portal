import { useEffect, useState } from 'react';
import ComplaintTable from '../components/ComplaintTable';
import { getComplaints, getOfficers, assignOfficer, updateComplaintStatus } from '../../api';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ManageComplaints = () => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');

  useEffect(() => {
    getComplaints().then(setComplaints).catch(console.error);
    getOfficers().then(setOfficers).catch(console.error);
  }, []);

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsModalOpen(true);
  };

  const handleAssign = (complaint) => {
    setSelectedComplaint(complaint);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    try {
      const updated = await assignOfficer(selectedComplaint.id, parseInt(selectedOfficer));
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      alert(t('adminComplaintAssigned').replace('{id}', selectedComplaint.token).replace('{officer}', updated.assigned_officer?.name));
    } catch (err) {
      alert(err.message);
    }
    setIsAssignModalOpen(false);
    setSelectedOfficer('');
  };

  const handleStatusUpdate = async (complaintId, status) => {
    try {
      const updated = await updateComplaintStatus(complaintId, status);
      setComplaints((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusLabel = (status) => {
    if (status === 'Pending') return t('pending');
    if (status === 'In Progress') return t('inProgress');
    if (status === 'Resolved') return t('adminResolved');
    return status;
  };

  // Normalize for ComplaintTable which expects .citizenName, .dateSubmitted etc.
  const normalizedComplaints = complaints.map((c) => ({
    ...c,
    citizenName: c.citizen_name,
    dateSubmitted: c.submitted_at?.split('T')[0],
    department: c.department?.name,
    assignedOfficer: c.assigned_officer?.name || null,
  }));

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl text-gray-800 mb-4 md:mb-6">{t('adminManageComplaints')}</h2>

      <ComplaintTable
        complaints={normalizedComplaints}
        onViewDetails={(c) => handleViewDetails(complaints.find((x) => x.id === c.id) || c)}
        onAssign={(c) => handleAssign(complaints.find((x) => x.id === c.id) || c)}
        showAssignButton={true}
      />

      {/* Details Modal */}
      {isDetailsModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0f766e] text-white p-3 md:p-6 flex justify-between items-center rounded-t-xl">
              <h3 className="text-lg md:text-2xl">{t('adminComplaintDetails')}</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="p-1.5 md:p-2 hover:bg-[#115e59] rounded-lg">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="p-3 md:p-6 space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div><p className="text-sm text-gray-600">{t('grievanceId')}</p><p className="font-semibold text-sm md:text-base">{selectedComplaint.token}</p></div>
                <div><p className="text-sm text-gray-600">{t('currentStatus')}</p><span className="inline-block px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs bg-[#f0fdfa] text-[#0f766e]">{getStatusLabel(selectedComplaint.status)}</span></div>
                <div><p className="text-sm text-gray-600">{t('adminCitizen')}</p><p className="font-semibold text-sm md:text-base">{selectedComplaint.citizen_name}</p></div>
                <div><p className="text-sm text-gray-600">{t('phone')}</p><p className="font-semibold text-sm md:text-base">{selectedComplaint.phone}</p></div>
                <div><p className="text-sm text-gray-600">{t('department')}</p><p className="font-semibold text-sm md:text-base">{selectedComplaint.department?.name}</p></div>
                <div className="sm:col-span-2"><p className="text-sm text-gray-600">{t('address')}</p><p className="font-semibold text-sm md:text-base">{selectedComplaint.address_line1}</p></div>
              </div>
              <div><p className="text-sm text-gray-600 mb-1 md:mb-2">{t('adminDescription')}</p><p className="text-gray-700 text-sm md:text-base">{selectedComplaint.message}</p></div>

              {/* Status update */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['Under Review', 'In Progress', 'Action Taken', 'Resolved', 'Closed'].map((s) => (
                    <button key={s} onClick={() => handleStatusUpdate(selectedComplaint.id, s)}
                      className="px-3 py-1 rounded-full text-xs border border-teal-300 hover:bg-teal-50 text-[#0f766e]">
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {selectedComplaint.assigned_officer && (
                <div className="bg-[#f0fdfa] p-3 md:p-4 rounded-lg">
                  <p className="text-sm text-gray-600">{t('adminAssignedOfficer')}</p>
                  <p className="font-semibold text-[#0f766e] text-sm md:text-base">{selectedComplaint.assigned_officer?.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {isAssignModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-[#0f766e] text-white p-3 md:p-6 flex justify-between items-center rounded-t-xl">
              <h3 className="text-lg md:text-xl">{t('adminAssignComplaint')}</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-1.5 md:p-2 hover:bg-[#115e59] rounded-lg">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <div className="p-3 md:p-6">
              <div className="mb-3 md:mb-4">
                <p className="text-sm text-gray-600">{t('grievanceId')}</p>
                <p className="font-semibold text-[#0f766e] text-sm md:text-base">{selectedComplaint.token}</p>
              </div>
              <div className="mb-4 md:mb-6">
                <label className="block text-sm text-gray-700 mb-2">{t('adminSelectOfficer')} <span className="text-red-500">*</span></label>
                <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e]">
                  <option value="">{t('adminChooseOfficer')}</option>
                  {officers
                    .filter((o) => o.department?.name === selectedComplaint.department?.name)
                    .map((officer) => (
                      <option key={officer.id} value={officer.id}>{officer.name} - {officer.department?.name}</option>
                    ))}
                </select>
              </div>
              <div className="flex gap-2 md:gap-3 justify-end">
                <button onClick={() => setIsAssignModalOpen(false)} className="px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">{t('cancel')}</button>
                <button onClick={handleAssignSubmit} disabled={!selectedOfficer}
                  className="px-3 md:px-4 py-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] disabled:bg-gray-400 disabled:cursor-not-allowed text-sm">
                  {t('adminAssign')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageComplaints;
