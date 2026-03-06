function HomeFeedback({ isTamil, feedbacks }) {
  return (
    <section id="help" className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#0F766E]">{isTamil ? 'மக்கள் கருத்துகள்' : 'Citizen Feedback'}</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {feedbacks.map((item) => (
            <div key={item.name} className="rounded-xl border border-slate-200 bg-[#F5F7FA] p-5">
              <p className="text-slate-700">"{item.text}"</p>
              <p className="mt-4 font-semibold text-[#0F766E]">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFeedback;
