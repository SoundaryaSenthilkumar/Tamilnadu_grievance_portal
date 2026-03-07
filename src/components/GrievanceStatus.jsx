import { useLanguage } from "../context/LanguageContext";

export default function GrievanceStatus({ grievance }) {
  const { t } = useLanguage();
  if (!grievance) return null;

  const getStatusColor = (status) => {
    if (status === "Closed") return "text-green-600";
    if (status === "In Progress") return "text-orange-600";
    if (status === "Under Review") return "text-teal-600";
    return "text-blue-600";
  };

  const isStepComplete = (step) => {
    const steps = ["Pending", "Submitted", "Under Review", "In Progress", "Closed"];
    const currentIndex = steps.indexOf(grievance.status);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex;
  };

  const getStatusTranslation = (status) => {
    const statusMap = {
      "Pending": "pending",
      "Submitted": "submitted",
      "Under Review": "underReview",
      "In Progress": "inProgress",
      "Closed": "closed"
    };
    return t(statusMap[status] || "closed");
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-[#0f766e] p-6" style={{ marginBottom: '70px' }}>
      <div className="flex items-center gap-3 mb-4">
        {t('currentStatus')}: 
        <span className={`font-semibold ml-1 ${getStatusColor(grievance.status)}`}>
          {getStatusTranslation(grievance.status)}
        </span>
      </div>

      <div className="flex items-center justify-between relative mb-10">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-300"></div>
        <div 
          className="absolute top-5 left-0 h-1 bg-[#0f766e] transition-all duration-500"
          style={{ width: grievance.status === "Pending" ? "0%" : grievance.status === "Submitted" ? "20%" : grievance.status === "Under Review" ? "40%" : grievance.status === "In Progress" ? "60%" : "100%" }}
        ></div>

        <div className="flex flex-col items-center flex-1 text-center z-10">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs ${isStepComplete("Pending") ? "bg-[#0f766e] text-white" : "bg-gray-200 text-gray-500"}`}>
            {isStepComplete("Pending") ? "✓" : "⏸"}
          </div>
          <p className="text-[10px] sm:text-xs mt-2 whitespace-nowrap">{t('pending')}</p>
        </div>

        <div className="flex flex-col items-center flex-1 text-center z-10">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs ${isStepComplete("Submitted") ? "bg-[#0f766e] text-white" : "bg-gray-200 text-gray-500"}`}>
            ✓
          </div>
          <p className="text-[10px] sm:text-xs mt-2 whitespace-nowrap">{t('submitted')}</p>
        </div>

        <div className="flex flex-col items-center flex-1 text-center z-10">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs ${isStepComplete("Under Review") ? "bg-[#0f766e] text-white" : "bg-gray-200 text-gray-500"}`}>
            {isStepComplete("Under Review") ? "✓" : "⏱"}
          </div>
          <p className="text-[10px] sm:text-xs mt-2 whitespace-nowrap">{t('underReview')}</p>
        </div>

        <div className="flex flex-col items-center flex-1 text-center z-10">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs ${isStepComplete("In Progress") ? "bg-[#0f766e] text-white" : "bg-gray-200 text-gray-500"}`}>
            {isStepComplete("In Progress") ? "✓" : "⚙"}
          </div>
          <p className="text-[10px] sm:text-xs mt-2 whitespace-nowrap">{t('inProgress')}</p>
        </div>

        <div className="flex flex-col items-center flex-1 text-center z-10">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs ${isStepComplete("Closed") ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>
            {isStepComplete("Closed") ? "✓" : "✕"}
          </div>
          <p className="text-[10px] sm:text-xs mt-2 whitespace-nowrap">{t('completed')}</p>
        </div>
      </div>

      <div className="border-l-2 border-gray-300 pl-6 space-y-6">
        <div className="relative">
          <div className="absolute -left-8 top-1 w-4 h-4 bg-[#0f766e] rounded-full"></div>
          <h4 className="font-semibold">
            {t('pending')} <span className="text-sm text-gray-500 ml-2">{new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </h4>
          <p className="text-gray-600 text-sm">{t('pendingDesc')}</p>
        </div>

        <div className="relative">
          <div className="absolute -left-8 top-1 w-4 h-4 bg-[#0f766e] rounded-full"></div>
          <h4 className="font-semibold">
            {t('submitted')} <span className="text-sm text-gray-500 ml-2">{new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </h4>
          <p className="text-gray-600 text-sm">{t('submittedDesc')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('officer')}: Ramesh Kumar, {t('municipalityOfficer')}</p>
        </div>

        {(grievance.status === "Under Review" || grievance.status === "In Progress" || grievance.status === "Closed") && (
          <div className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 bg-[#0f766e] rounded-full"></div>
            <h4 className="font-semibold">
              {t('underReview')} <span className="text-sm text-gray-500 ml-2">{new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </h4>
            <p className="text-gray-600 text-sm">{t('underReviewDesc')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('officer')}: Mr. Balaji K, {t('tahsildar')}</p>
          </div>
        )}

        {(grievance.status === "In Progress" || grievance.status === "Closed") && (
          <div className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 bg-[#0f766e] rounded-full"></div>
            <h4 className="font-semibold">
              {t('inProgress')} <span className="text-sm text-gray-500 ml-2">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </h4>
            <p className="text-gray-600 text-sm">{grievance.remarks}</p>
            <p className="text-xs text-gray-500 mt-1">{t('officer')}: Suresh Babu, {t('fieldInspector')}</p>
          </div>
        )}

        {grievance.status === "Closed" && (
          <div className="relative">
            <div className="absolute -left-8 top-1 w-4 h-4 bg-green-600 rounded-full"></div>
            <h4 className="font-semibold">
              {t('completed')} <span className="text-sm text-gray-500 ml-2">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </h4>
            <p className="text-gray-600 text-sm">{t('completedDesc')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('closedBy')}: {t('districtOfficer')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
