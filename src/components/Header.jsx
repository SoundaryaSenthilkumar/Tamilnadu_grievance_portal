import { useState } from 'react';
import { Link } from 'react-router-dom';
import portalLogo from '../assets/download.webp';
import { useLanguage } from '../context/LanguageContext';

function Header() {
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isTamil = language === 'ta';

  const navLinks = [
    { label: isTamil ? 'முகப்பு' : 'Home', to: '/' },
    { label: isTamil ? 'புகார் பதிவு' : 'Raise Complaint', to: '/raise-complaint' },
    { label: isTamil ? 'புகார் கண்காணிப்பு' : 'Track Complaint', to: '/track-complaint' },
    { label: isTamil ? 'துறைகள்' : 'Departments', to: '/#departments' },
    { label: isTamil ? 'உதவி' : 'Helpline', to: '/#helpline' },
    { label: isTamil ? 'நிர்வாக உள்நுழைவு' : 'Admin Login', to: '/admin-login' },
  ];

  return (
    <header className="bg-[#0F766E] text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full border-2 border-[#F4B400] bg-white p-1 shadow-md overflow-hidden">
              <img
                src={portalLogo}
                alt="Tamil Nadu Government Emblem"
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight sm:text-lg">
                {isTamil
                  ? 'தமிழ்நாடு பொதுமக்கள் குறைதீர் இணையத் தளம்'
                  : 'Tamil Nadu Public Grievance Redressal Portal'}
              </h1>
              <p className="text-xs text-slate-200">
                {isTamil ? 'தமிழ்நாடு அரசு' : 'Government of Tamil Nadu'}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((item) => {
              const linkTo = item.to.includes('#')
                ? { pathname: '/', hash: item.to.slice(1) }
                : item.to;

              return (
                <Link
                  key={item.label}
                  to={linkTo}
                  className="text-sm font-medium transition-colors hover:text-[#F4B400]"
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'))}
              className="rounded-md border border-[#F4B400] px-3 py-1.5 text-sm font-semibold text-[#F4B400] transition hover:bg-[#F4B400] hover:text-[#0F766E]"
            >
              {isTamil ? 'தமிழ் / English' : 'English / தமிழ்'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((s) => !s)}
            className="rounded-md border border-white/40 p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
        </div>

        {mobileOpen && (
          <div className="space-y-2 pb-4 lg:hidden">
            {navLinks.map((item) => {
              const linkTo = item.to.includes('#')
                ? { pathname: '/', hash: item.to.slice(1) }
                : item.to;

              return (
                <Link key={item.label} to={linkTo} className="block rounded-md px-3 py-2 text-sm hover:bg-white/10">
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'))}
              className="w-full rounded-md border border-[#F4B400] px-3 py-2 text-left text-sm font-semibold text-[#F4B400]"
            >
              {isTamil ? 'தமிழ் / English' : 'English / தமிழ்'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export default Header;
