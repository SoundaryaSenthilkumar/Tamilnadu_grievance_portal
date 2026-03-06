function HomeDashboardStats({ isTamil, dashboardStats }) {
  return (
    <section id="statistics" className="border-y border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#0F766E]">{isTamil ? 'புகார் புள்ளிவிவர பலகை' : 'Complaint Statistics Dashboard'}</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-[#F5F7FA] p-5">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#0F766E] sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeDashboardStats;
