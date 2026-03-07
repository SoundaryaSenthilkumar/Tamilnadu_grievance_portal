import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function StatusTracker({ onSearch }) {
  const { t } = useLanguage();
  const [grievanceId, setGrievanceId] = useState("");
  const [error, setError] = useState("");

  const formatGrievanceId = (value) => {
    // Only allow a-z and 0-9 characters, convert to uppercase
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limit to 10 characters
    return cleaned.slice(0, 10);
  };

  const handleChange = (e) => {
    const formatted = formatGrievanceId(e.target.value);
    setGrievanceId(formatted);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (grievanceId.length === 10) {
      setError("");
      onSearch(grievanceId);
    } else {
      setError(t('errorComplete'));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-[#0f766e] p-4 sm:p-6 mt-10" style={{ marginBottom: '70px' }}>
      
      <h2 className="text-xl font-semibold text-slate-800">
        {t('trackTitle')}
      </h2>

      <p className="text-sm text-slate-600 mt-1">
        {t('trackDescription')}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mt-5">
        
        <div className="flex-1">
          <input
            type="text"
            placeholder="A7K3D9P2X4"
            className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-[#0f766e]'} font-mono uppercase`}
            value={grievanceId}
            onChange={handleChange}
            maxLength={10}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <button 
          type="submit"
          className="bg-[#0f766e] text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#0f766e] hover:border hover:border-[#0f766e] active:scale-95"
        >
          {t('search')}
        </button>

      </form>

      <div className="mt-4">
        <p className="text-xs text-slate-500 font-medium mb-2">{t('demoIds')}</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">A7K3D9P2X4 ({t('pending')})</span>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">B8M1Q4T6Z9 ({t('submitted')})</span>
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">C5R8V2N7Y1 ({t('underReview')})</span>
          <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">D9X3K6P1W8 ({t('inProgress')})</span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">E2Z7M4S9T5 ({t('closed')})</span>
        </div>
      </div>

    </div>
  );
}
