import ProofViewer from "./ProofViewer";
import { useLanguage } from "../context/LanguageContext";

export default function CitizenProfile({ profile, grievance }) {
  const { t } = useLanguage();
  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#0f766e] p-4 sm:p-6" style={{ marginBottom: '70px' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f766e]/10">
          <svg className="w-5 h-5 text-[#0f766e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-[#0f766e] whitespace-nowrap">{t('citizenProfile')}</h2>
      </div>

      <hr className="mb-5" />

      <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#0f766e] mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs tracking-wide uppercase">{t('name')}</p>
            <p className="font-medium truncate">{profile.name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#0f766e] mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs tracking-wide uppercase">{t('address')}</p>
            <p className="break-words">{profile.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#0f766e] mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs tracking-wide uppercase">{t('district')}</p>
            <p className="whitespace-nowrap">{profile.district}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#0f766e] mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs tracking-wide uppercase">{t('email')}</p>
            <p className="truncate">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#0f766e] mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs tracking-wide uppercase">{t('phone')}</p>
            <p className="whitespace-nowrap">{profile.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[#0f766e] mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <div className="min-w-0">
            <p className="text-gray-500 text-xs tracking-wide uppercase">{t('pincode')}</p>
            <p className="whitespace-nowrap">{profile.pincode}</p>
          </div>
        </div>
      </div>

      <hr className="my-6" />

      <div className="flex items-center gap-2 mb-4">
        <i className="fa-regular fa-file-lines text-[#0f766e]"></i>
        <h3 className="font-semibold text-gray-800">{t('grievanceDetails')}</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">{t('grievanceId')}</span>
          <span className="font-semibold text-red-600">{grievance.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">{t('dateSubmitted')}</span>
          <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">{t('department')}</span>
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-building text-[#0f766e]"></i>
            {grievance.department}
          </span>
        </div>
      </div>

      <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-500 uppercase mb-1">{t('subject')}</p>
        <p className="font-medium text-gray-800">{grievance.subject}</p>
        <p className="text-sm text-gray-600 mt-2">{grievance.description}</p>
        
        <ProofViewer imageUrl={grievance.proofUrl} />
      </div>
    </div>
  );
}