import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const TEXT = {
  en: {
    errorComplete: "Please enter all 10 characters.",
    trackTitle: "Track Your Grievance",
    trackDescription: "Enter your Grievance Token to view the current status of your complaint.",
    search: "Search",
    tokenHint: "Token format: 5 letters + 5 digits (e.g. ABCDE12345)",
  },
  ta: {
    errorComplete: "10 எழுத்துகள் முழுவதும் உள்ளிடவும்.",
    trackTitle: "உங்கள் குறையைக் கண்காணிக்கவும்",
    trackDescription: "உங்கள் புகாரின் தற்போதைய நிலையைப் பார்க்க டோக்கனை உள்ளிடவும்.",
    search: "தேடு",
    tokenHint: "டோக்கன் வடிவம்: 5 எழுத்துகள் + 5 இலக்கங்கள்",
  },
};

export default function StatusTracker({ onSearch }) {
  const { language } = useLanguage();
  const t = (key) => (language === "ta" ? TEXT.ta[key] : TEXT.en[key]) || key;
  const [grievanceId, setGrievanceId] = useState("");
  const [error, setError] = useState("");

  const formatToken = (value) =>
    value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  const handleChange = (e) => {
    setGrievanceId(formatToken(e.target.value));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (grievanceId.length === 10) {
      setError("");
      onSearch(grievanceId);
    } else {
      setError(t("errorComplete"));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border border-[#0f766e] p-4 sm:p-6 mt-10" style={{ marginBottom: "70px" }}>
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t("trackTitle")}</h1>
        <p className="text-gray-600">{t("trackDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ABCDE12345"
            className={`w-full border ${error ? "border-red-500" : "border-gray-300"} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-[#0f766e]"} font-mono uppercase`}
            value={grievanceId}
            onChange={handleChange}
            maxLength={10}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <p className="text-xs text-gray-400 mt-1">{t("tokenHint")}</p>
        </div>

        <button
          type="submit"
          className="bg-[#0f766e] text-white px-6 py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#0f766e] hover:border hover:border-[#0f766e] active:scale-95"
        >
          {t("search")}
        </button>
      </form>
    </div>
  );
}
