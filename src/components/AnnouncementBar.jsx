import { useLanguage } from '../context/LanguageContext';

const AnnouncementBar = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const stats = [
    { icon: '⏱️', label: isTamil ? 'சராசரி தீர்வு நேரம்' : 'Average Resolution Time', value: isTamil ? '7 நாட்கள்' : '7 Days' },
    { icon: '✅', label: isTamil ? 'தீர்க்கப்பட்ட புகார்கள்' : 'Complaints Resolved', value: '95%' },
    { icon: '📞', label: isTamil ? 'உதவி எண்' : 'Helpline', value: '1800-425-1234' },
    { icon: '🏛️', label: isTamil ? 'மாவட்டங்கள்' : 'Districts Covered', value: '38' },
  ];

  return (
    <div className="bg-gradient-to-r from-secondary to-yellow-500 text-primary py-3 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-center space-x-2">
              <span className="text-xl">{stat.icon}</span>
              <div className="text-left">
                <p className="text-xs font-semibold">{stat.label}</p>
                <p className="text-sm md:text-base font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
