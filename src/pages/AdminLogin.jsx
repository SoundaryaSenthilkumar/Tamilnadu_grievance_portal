import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const ta = {
  title: "நிர்வாகி உள்நுழைவு",
  subtitle: "தமிழ்நாடு குறைதீர் தளம்",
  username: "பயனர்பெயர்",
  password: "கடவுச்சொல்",
  enterUsername: "பயனர்பெயரை உள்ளிடவும்",
  enterPassword: "கடவுச்சொல்லை உள்ளிடவும்",
  login: "உள்நுழைவு",
  forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
  alert: "நிர்வாகி உள்நுழைவு அம்சம் பின்னணி இணைப்புடன் செயல்படுத்தப்படும்.",
};

const en = {
  title: "Admin Login",
  subtitle: "Tamil Nadu Grievance Portal",
  username: "Username",
  password: "Password",
  enterUsername: "Enter username",
  enterPassword: "Enter password",
  login: "Login",
  forgotPassword: "Forgot Password?",
  alert: "Admin login functionality will be implemented with backend",
};

const AdminLogin = () => {
  const { language } = useLanguage();
  const isTamil = language === "ta";
  const copy = isTamil ? ta : en;
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(copy.alert);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-teal-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#0F766E] text-white shadow-md">
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#0F766E]">{copy.title}</h1>
          <p className="mt-2 text-sm text-teal-700">{copy.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-teal-800">{copy.username}</label>
            <input
              type="text"
              required
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full rounded-lg border border-teal-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              placeholder={copy.enterUsername}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-teal-800">{copy.password}</label>
            <input
              type="password"
              required
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full rounded-lg border border-teal-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              placeholder={copy.enterPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#0F766E] py-3 text-lg font-bold text-white transition hover:bg-teal-800"
          >
            {copy.login}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm font-medium text-[#0F766E] hover:text-teal-800">
            {copy.forgotPassword}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
