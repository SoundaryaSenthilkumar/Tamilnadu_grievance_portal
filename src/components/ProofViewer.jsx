import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ProofViewer({ imageUrl }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  if (!imageUrl) return null;

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 uppercase mb-2">
        {t('proofDocument')}
      </p>

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#0f766e] text-white px-4 py-2 rounded-lg hover:bg-[#0d5f58] transition"
      >
        <i className="fa-regular fa-eye"></i>
        {t('viewProof')}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-white p-4 rounded-xl shadow-lg max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 text-2xl hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <img
              src={imageUrl}
              alt="Proof Document"
              className="max-h-[500px] rounded-lg w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
