import { createContext, useContext, useState } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ta" : "en"));
  };

  const decodeMojibakeTamil = (value) => {
    if (typeof value !== "string") return value;
    if (/[\u0B80-\u0BFF]/.test(value)) return value;
    if (!/(?:Ã|Â|à®|à¯|â|ðŸ)/.test(value)) return value;

    try {
      const viaEscape = decodeURIComponent(escape(value));
      if (/[\u0B80-\u0BFF]/.test(viaEscape)) return viaEscape;
    } catch {
      // Fall back to byte-based decode below.
    }

    try {
      const bytes = Uint8Array.from(Array.from(value), (char) => char.charCodeAt(0) & 0xff);
      const decoded = new TextDecoder("utf-8").decode(bytes);
      return /[\u0B80-\u0BFF]/.test(decoded) ? decoded : value;
    } catch {
      return value;
    }
  };

  const t = (key) => {
    const value = translations[language]?.[key] || key;
    return language === "ta" ? decodeMojibakeTamil(value) : value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
