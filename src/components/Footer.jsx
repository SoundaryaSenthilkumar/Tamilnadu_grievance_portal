import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <footer className="bg-[#0F766E] text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h4 className="text-lg font-bold text-[#F4B400]">{isTamil ? 'இணையதளம் பற்றி' : 'About the Portal'}</h4>
          <p className="mt-3 text-sm text-slate-200">
            {isTamil
              ? 'தமிழ்நாடு மக்களுக்கு வெளிப்படையான மற்றும் காலக்கெடு கொண்ட குறைதீர் சேவையை வழங்கும் அதிகாரப்பூர்வ தளம்.'
              : 'Official grievance redressal platform for citizens of Tamil Nadu ensuring transparent, time-bound complaint resolution.'}
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#F4B400]">{isTamil ? 'தொடர்பு தகவல்' : 'Contact Information'}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{isTamil ? 'உதவி எண்: 1800-425-1234' : 'Helpline Number: 1800-425-1234'}</li>
            <li>{isTamil ? 'அதிகாரப்பூர்வ மின்னஞ்சல்: support@tnpgr.gov.in' : 'Official Email: support@tnpgr.gov.in'}</li>
            <li>{isTamil ? 'அலுவலக நேரம்: காலை 9:30 முதல் மாலை 6:00 வரை' : 'Office Hours: 9:30 AM to 6:00 PM'}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#F4B400]">{isTamil ? 'விரைவு இணைப்புகள்' : 'Quick Links'}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-[#F4B400]">
                {isTamil ? 'தனியுரிமைக் கொள்கை' : 'About us'}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#F4B400]">
                {isTamil ? 'விதிமுறைகள்' : 'Terms & Conditions'}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#F4B400]">
                {isTamil ? 'உதவி & ஆதரவு' : 'Help & Support'}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 py-3 text-center text-xs text-slate-300">
        {isTamil
          ? '© பதிப்புரிமை 2026 தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
          : '© Copyright 2026 Government of Tamil Nadu. All rights reserved.'}
      </div>
    </footer>
  );
}

export default Footer;
