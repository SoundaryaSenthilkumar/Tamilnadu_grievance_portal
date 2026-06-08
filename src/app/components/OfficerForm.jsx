import { useState } from 'react';
import { UserCog, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const OfficerForm = ({ onSubmit, initialData = null, departments = [] }) => {
  const { t, inputProps } = useLanguage();
  const [formData, setFormData] = useState(
    initialData
      ? {
          name: initialData.name,
          department_id: initialData.department_id || initialData.department?.id || '',
          email: initialData.email,
          phone: initialData.phone,
        }
      : { name: '', department_id: '', email: '', phone: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, department_id: parseInt(formData.department_id) });
    if (!initialData) {
      setFormData({ name: '', department_id: '', email: '', phone: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <UserCog className="w-5 h-5 md:w-6 md:h-6 text-[#0f766e]" />
        <h3 className="text-lg md:text-xl text-gray-800">
          {initialData ? t('adminEditOfficer') : t('adminAddNewOfficer')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            {t('adminOfficerName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            {...inputProps}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
            placeholder={t('adminOfficerNamePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            {t('department')} <span className="text-red-500">*</span>
          </label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            required
            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
          >
            <option value="">{t('adminSelectDepartment')}</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            {t('email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            lang="en"
            spellCheck={false}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
            placeholder="officer@tn.gov.in"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            {t('adminPhoneNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            lang="en"
            inputMode="numeric"
            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
            placeholder={t('adminPhonePlaceholder')}
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] transition-all duration-300 shadow-lg text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Save className="w-4 h-4 md:w-5 md:h-5" />
          {initialData ? t('adminUpdateOfficer') : t('adminAddOfficer')}
        </button>
      </div>
    </form>
  );
};

export default OfficerForm;
