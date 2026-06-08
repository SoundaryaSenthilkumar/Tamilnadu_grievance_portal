import { useEffect, useState } from 'react';
import OfficerForm from '../components/OfficerForm';
import { getOfficers, createOfficer, updateOfficer, deleteOfficer, getDepartments } from '../../api';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Officers = () => {
  const { t } = useLanguage();
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);

  useEffect(() => {
    getOfficers().then(setOfficers).catch(console.error);
    getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleAddOfficer = async (formData) => {
    try {
      const created = await createOfficer(formData);
      setOfficers((prev) => [...prev, created]);
      setShowForm(false);
    } catch (err) { alert(err.message); }
  };

  const handleEditOfficer = async (formData) => {
    try {
      const updated = await updateOfficer(editingOfficer.id, formData);
      setOfficers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setEditingOfficer(null);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteOfficer = async (id) => {
    if (confirm(t('adminDeleteOfficerConfirm'))) {
      try {
        await deleteOfficer(id);
        setOfficers((prev) => prev.filter((o) => o.id !== id));
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="p-3 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-0 mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl text-gray-800">{t('adminDepartmentOfficers')}</h2>
        <button onClick={() => { setShowForm(true); setEditingOfficer(null); }}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] shadow-lg text-sm md:text-base w-full sm:w-auto">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />{t('adminAddOfficer')}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 md:mb-6">
          <OfficerForm onSubmit={handleAddOfficer} departments={departments} />
        </div>
      )}

      {editingOfficer && (
        <div className="mb-4 md:mb-6">
          <OfficerForm onSubmit={handleEditOfficer} initialData={editingOfficer} departments={departments} />
          <button onClick={() => setEditingOfficer(null)}
            className="mt-3 md:mt-4 px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
            {t('cancel')}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg md:text-xl text-gray-800 mb-3 md:mb-4">{t('adminAllOfficers')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0f766e] text-white">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left rounded-tl-lg text-sm">S.No</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-sm">{t('name')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-sm hidden sm:table-cell">{t('department')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-sm hidden lg:table-cell">{t('email')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-sm hidden md:table-cell">{t('phone')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center rounded-tr-lg text-sm">{t('adminActions')}</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer, index) => (
                <tr key={officer.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-sm">{index + 1}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-sm">{officer.name}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden sm:table-cell">{officer.department?.name}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden lg:table-cell">{officer.email}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm hidden md:table-cell">{officer.phone}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button onClick={() => { setEditingOfficer(officer); setShowForm(false); }}
                        className="p-1.5 md:p-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59]" title={t('adminEdit')}>
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button onClick={() => handleDeleteOfficer(officer.id)}
                        className="p-1.5 md:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" title={t('adminRemove')}>
                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
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

export default Officers;
