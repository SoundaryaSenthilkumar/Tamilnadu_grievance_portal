import { useState } from 'react';
import { Building2, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DepartmentForm = ({ onSubmit, initialData = null }) => {
  const { t, inputProps, language } = useLanguage();
  const [formData, setFormData] = useState(
    initialData || { name: '', code: '' }
  );

  const sanitizeEnglishText = (value) => value.replace(/[\u0B80-\u0BFF]/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = language === 'en' ? sanitizeEnglishText(value) : value;
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({ name: '', code: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 md:p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <Building2 className="w-5 h-5 md:w-6 md:h-6 text-[#0f766e]" />
        <h3 className="text-lg md:text-xl text-gray-800">
          {initialData ? t('adminEditDepartment') : t('adminAddNewDepartment')}
        </h3>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            {t('adminDepartmentName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            {...inputProps}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
            placeholder={t('adminDepartmentNamePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1 md:mb-2">
            {t('adminDepartmentCode')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            {...inputProps}
            className="w-full px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white text-sm md:text-base"
            placeholder={t('adminDepartmentCodePlaceholder')}
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#0f766e] text-white rounded-lg hover:bg-[#115e59] transition-all duration-300 shadow-lg text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Save className="w-4 h-4 md:w-5 md:h-5" />
          {initialData ? t('adminUpdateDepartment') : t('adminAddDepartment')}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
