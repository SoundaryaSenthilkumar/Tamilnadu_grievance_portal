import { User, LogOut, Menu, X, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import emblemImage from '../../assets/img.jpeg';
import { useLanguage } from '../../context/LanguageContext';

const Header = ({ onLogout, menuItems }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#0f766e] text-white shadow-lg sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-[#115e59] rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden">
                <img src={emblemImage} alt="Tamil Nadu Emblem" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-tight text-white">
                {t('adminPortalTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5 hidden md:block">
                {t('adminPortalTitleTa')}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center">
            {menuItems?.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base font-medium ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="w-4 h-4 lg:w-5 lg:h-5">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            <div className="hidden sm:block">
              <button
                onClick={toggleLanguage}
                className="rounded-md border border-[#F4B400] px-3 py-1.5 text-sm font-semibold text-[#F4B400] transition hover:bg-[#F4B400] hover:text-[#0F766E]"
                aria-label={t('adminLanguage')}
              >
                {language === 'ta' ? 'தமிழ் / English' : 'English / தமிழ்'}
              </button>
            </div>

            <div className="relative group">
              <NavLink
                to="/admin/settings"
                className="flex items-center justify-center w-10 h-10 bg-[#115e59] hover:bg-[#134e4a] rounded-lg transition-all duration-200 hover:-translate-y-0.5"
                aria-label={t('adminSettings')}
              >
                <Settings className="w-5 h-5 text-white" />
              </NavLink>
            </div>

            <div className="relative group" ref={profileRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-all duration-200 hover:-translate-y-0.5"
                aria-label={t('adminProfile')}
              >
                <User className="w-5 h-5 text-[#0f766e]" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{t('adminLoggedIn')}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('adminLogout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0f766e] border-t border-[#115e59]">
          <div className="px-3 py-2 sm:hidden">
            <h1 className="text-base font-bold text-white">{t('adminPortalShort')}</h1>
          </div>

          <div className="px-4 py-2 border-b border-[#115e59]">
            <button
              onClick={toggleLanguage}
              className="w-full rounded-md border border-[#F4B400] px-3 py-2 text-left text-sm font-semibold text-[#F4B400]"
              aria-label={t('adminLanguage')}
            >
              {language === 'ta' ? '????? / English' : 'English / ?????'}
            </button>
          </div>

          <nav className="flex flex-col py-2">
            {menuItems?.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white font-medium'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
