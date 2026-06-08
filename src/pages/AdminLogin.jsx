import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { adminLogin } from "../api";

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(credentials.username, credentials.password);
      sessionStorage.setItem("tn_admin_authenticated", "1");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-[#0F766E]">{t("adminLoginTitle")}</h1>
          <p className="mt-2 text-sm text-teal-700">{t("adminLoginSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-semibold text-teal-800">{t("adminUsername")}</label>
            <input
              type="text"
              required
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full rounded-lg border border-teal-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              placeholder={t("adminEnterUsername")}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-teal-800">{t("adminPassword")}</label>
            <input
              type="password"
              required
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full rounded-lg border border-teal-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              placeholder={t("adminEnterPassword")}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0F766E] py-3 text-lg font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : t("adminLoginButton")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm font-medium text-[#0F766E] hover:text-teal-800">
            {t("adminForgotPassword")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
