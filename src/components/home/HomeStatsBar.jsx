function HomeStatsBar({ statsBar }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 text-center md:grid-cols-4">
          {statsBar.map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-600">{item.label}</p>
              <p className="text-sm font-bold text-[#0F766E] sm:text-base">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeStatsBar;
