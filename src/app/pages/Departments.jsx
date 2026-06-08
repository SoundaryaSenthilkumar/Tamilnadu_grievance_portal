import { useEffect, useState } from 'react';
import DepartmentForm from '../components/DepartmentForm';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Departments = () => {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleAddDepartment = async (formData) => {
    try {
      const created = await createDepartment(formData);
      setDepartments((prev) => [...prev, created]);
      setShowForm(false);
    } catch (err) { alert(err.message); }
  };

  const handleEditDepartment = async (formData) => {
    try {
      const updated = await updateDepartment(editingDepartment.id, formData);
      setDepartments((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setEditingDepartment(null);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteDepartment = async (id) => {
    if (confirm(t('adminDeleteDepartmentConfirm'))) {
      try {
        await deleteDepartment(id);
        setDepartments((prev) => prev.filter((d) => d.id !== id));
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="p-3 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-0 mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl text-gray-800">{t('adminMenuDepartments')}</h2>
        <button onClick={() => { setShowForm(true); setEditingDepartment(null); }}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] shadow-lg text-sm md:text-base w-full sm:w-auto">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />{t('adminAddDepartment')}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 md:mb-6">
          <DepartmentForm onSubmit={handleAddDepartment} />
        </div>
      )}

      {editingDepartment && (
        <div className="mb-4 md:mb-6">
          <DepartmentForm onSubmit={handleEditDepartment} initialData={editingDepartment} />
          <button onClick={() => setEditingDepartment(null)}
            className="mt-3 md:mt-4 px-3 md:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
            {t('cancel')}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg md:text-xl text-gray-800 mb-3 md:mb-4">{t('adminAllDepartments')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0f766e] text-white">
                <th className="px-2 md:px-4 py-2 md:py-3 text-left rounded-tl-lg text-sm">S.No</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-sm">{t('adminDepartmentName')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left text-sm">{t('adminDepartmentCode')}</th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-center rounded-tr-lg text-sm">{t('adminActions')}</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={dept.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-sm">{index + 1}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-sm">{dept.name}</td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-[#f0fdfa] text-[#0f766e] rounded-full text-xs md:text-sm">{dept.code}</span>
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3">
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <button onClick={() => { setEditingDepartment(dept); setShowForm(false); }}
                        className="p-1.5 md:p-2 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59]" title={t('adminEdit')}>
                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                      <button onClick={() => handleDeleteDepartment(dept.id)}
                        className="p-1.5 md:p-2 bg-red-600 text-white rounded-lg hover:bg-red-700" title={t('adminDelete')}>
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

export default Departments;
