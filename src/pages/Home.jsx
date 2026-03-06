import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import slideFarmer from '../assets/slide/indian-farmer-sugarcane-field.jpg';
import slideTempleGopuram from '../assets/slide/intricate-gopuram-hindu-temple.jpg';
import slideTempleWall from '../assets/slide/ornate-dragon-sculptures-ancient-temple-wall.jpg';
import slideOx from '../assets/slide/white-bovine-ox-grazing-agricultural-field-goa-india.jpg';
import HomeStatsBar from '../components/home/HomeStatsBar';
import HomeHero from '../components/home/HomeHero';
import HomeQuickServices from '../components/home/HomeQuickServices';
import HomeDashboardStats from '../components/home/HomeDashboardStats';
import HomeDepartments from '../components/home/HomeDepartments';
import HomeHowItWorks from '../components/home/HomeHowItWorks';
import HomeAnnouncements from '../components/home/HomeAnnouncements';
import HomeFeedback from '../components/home/HomeFeedback';

function Home() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';
  const slideImages = [slideFarmer, slideTempleGopuram, slideTempleWall, slideOx];

  const statsBar = [
    { label: isTamil ? 'சராசரி தீர்வு நேரம்' : 'Average Resolution Time', value: isTamil ? '7 நாட்கள்' : '7 Days' },
    { label: isTamil ? 'தீர்க்கப்பட்ட புகார்கள்' : 'Complaints Resolved', value: '95%' },
    { label: isTamil ? 'உதவி எண்' : 'Helpline', value: '1800-425-1234' },
    { label: isTamil ? 'மாவட்டங்கள்' : 'Districts Covered', value: '38' },
  ];

  const quickServices = [
    {
      title: isTamil ? 'புகார் பதிவு' : 'Register Complaint',
      desc: isTamil
        ? 'உங்கள் குறையை விவரங்களுடன் மற்றும் ஆவணங்களுடன் பதிவு செய்யலாம்.'
        : 'Submit a grievance with details and supporting documents.',
      icon: FilePlusIcon,
      to: '/raise-complaint',
    },
    {
      title: isTamil ? 'புகார் கண்காணிப்பு' : 'Track Complaint',
      desc: isTamil
        ? 'உங்கள் குறைப்பு எண்ணை பயன்படுத்தி சமீபத்திய நிலையை பார்க்கவும்.'
        : 'Check the latest complaint status with your reference ID.',
      icon: SearchIcon,
      to: '/track-complaint',
    },
    {
      title: isTamil ? 'புள்ளிவிவரங்கள்' : 'Complaint Statistics',
      desc: isTamil
        ? 'தீர்வு நிலை மற்றும் வெளிப்படைத் தன்மை குறியீடுகளை பாருங்கள்.'
        : 'View disposal trends and public transparency indicators.',
      icon: BarChartIcon,
      to: '#statistics',
    },
    {
      title: isTamil ? 'துறை பட்டியல்' : 'Department Directory',
      desc: isTamil
        ? 'துறைகள் மற்றும் குறைதீர் அதிகாரிகளை உலாவலாம்.'
        : 'Browse departments and nodal grievance officers.',
      icon: BuildingIcon,
      to: '#departments',
    },
  ];

  const dashboardStats = [
    { label: isTamil ? 'மொத்த புகார்கள்' : 'Total Complaints', value: '12,48,320' },
    { label: isTamil ? 'தீர்க்கப்பட்டவை' : 'Resolved Complaints', value: '11,86,904' },
    { label: isTamil ? 'நிலுவையில்' : 'Pending Complaints', value: '61,416' },
    { label: isTamil ? 'உள்ளடங்கிய துறைகள்' : 'Departments Covered', value: '42' },
  ];

  const departments = isTamil
    ? [
        { name: 'வருவாய் துறை', href: '#' },
        { name: 'காவல் துறை', href: '#' },
        { name: 'மின்சார வாரியம்', href: '#' },
        { name: 'குடிநீர் வழங்கல்', href: '#' },
        { name: 'நகராட்சி நிர்வாகம்', href: '#' },
        { name: 'போக்குவரத்து துறை', href: '#' },
        { name: 'சுகாதார துறை', href: '#' },
      ]
    : [
        { name: 'Revenue Department', href: '#' },
        { name: 'Police Department', href: '#' },
        { name: 'Electricity Board', href: '#' },
        { name: 'Water Supply', href: '#' },
        { name: 'Municipal Administration', href: '#' },
        { name: 'Transport Department', href: '#' },
        { name: 'Health Department', href: '#' },
      ];

  const announcements = isTamil
    ? [
        'மாவட்ட குறைதீர் முகாம்கள் மார்ச் 15, 2026 முதல் நடைபெறும்.',
        'அனைத்து குறை நிலை மாற்றங்களுக்கும் SMS மற்றும் மின்னஞ்சல் அறிவிப்புகள் செயல்படுத்தப்பட்டுள்ளன.',
        'நீண்டநாள் நிலுவையில் உள்ள புகார்களுக்கு சிறப்பு தீர்வு இயக்கம் தொடங்கப்பட்டுள்ளது.',
      ]
    : [
        'District grievance redressal camps will be held from March 15, 2026.',
        'SMS and email alerts are now enabled for all complaint status changes.',
        'Special disposal drive launched for long-pending grievances across districts.',
      ];

  const feedbacks = isTamil
    ? [
        {
          name: 'எஸ். கார்த்திக், கோயம்புத்தூர்',
          text: 'என் குடிநீர் பிரச்சினை 5 நாட்களில் தீர்க்கப்பட்டது. போர்டல் புதுப்பிப்புகள் மிகவும் சரியாக இருந்தன.',
        },
        {
          name: 'ஆர். மீனா, மதுரை',
          text: 'புகார் செயல்முறை எளிமையாக இருந்தது. ஒவ்வொரு கட்டத்தையும் தெளிவாக கண்காணிக்க முடிந்தது.',
        },
        {
          name: 'ஏ. பிரகாஷ், சென்னை',
          text: 'துறை விரைவாக பதிலளித்தது; இறுதி தீர்வு திருப்திகரமாக இருந்தது.',
        },
      ]
    : [
        {
          name: 'S. Karthik, Coimbatore',
          text: 'My drinking water issue was resolved in 5 days and the portal updates were timely.',
        },
        {
          name: 'R. Meena, Madurai',
          text: 'The complaint process was simple and I could track every stage clearly.',
        },
        {
          name: 'A. Prakash, Chennai',
          text: 'The department responded quickly and the final resolution was satisfactory.',
        },
      ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800">
      <Header />
      <HomeStatsBar statsBar={statsBar} />
      <HomeHero isTamil={isTamil} slideImages={slideImages} />
      <HomeQuickServices isTamil={isTamil} quickServices={quickServices} />
      <HomeDashboardStats isTamil={isTamil} dashboardStats={dashboardStats} />
      <HomeDepartments isTamil={isTamil} departments={departments} />
      <HomeHowItWorks isTamil={isTamil} />
      <HomeAnnouncements isTamil={isTamil} announcements={announcements} />
      <HomeFeedback isTamil={isTamil} feedbacks={feedbacks} />
      <Footer />
    </div>
  );
}

function FilePlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M12 18v-6M9 15h6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M8 17v-5M12 17V9M16 17v-8" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
      <path d="M9 10h.01M9 14h.01M9 18h.01M15 10h.01M15 14h.01M15 18h.01" />
    </svg>
  );
}

export default Home;
