function HomeAnnouncements({ isTamil, announcements }) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#0F766E]">{isTamil ? 'சமீபத்திய அறிவிப்புகள்' : 'Latest Announcements'}</h3>
        <div className="mt-6 space-y-3">
          {announcements.map((note) => (
            <div key={note} className="rounded-lg border-l-4 border-[#F4B400] bg-white p-4 shadow-sm">
              <p className="text-slate-700">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeAnnouncements;
