const DashboardCard = ({ title, value, icon, color = 'blue', subtitle }) => {
  return (
    <div className="bg-[#0f766e] rounded-xl p-3 md:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm opacity-90 mb-0.5 md:mb-1">{title}</p>
          <h3 className="text-2xl md:text-4xl mb-1 md:mb-2">{value}</h3>
          {subtitle && <p className="text-xs opacity-80 hidden sm:block">{subtitle}</p>}
        </div>
        <div className="bg-[#115e59] p-2 md:p-4 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
