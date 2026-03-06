function HomeHowItWorks({ isTamil }) {
  const steps = isTamil
    ? ['படி 1: புகார் பதிவு', 'படி 2: துறை ஆய்வு', 'படி 3: விசாரணை', 'படி 4: தீர்வு']
    : ['Step 1: Register Complaint', 'Step 2: Department Review', 'Step 3: Investigation', 'Step 4: Resolution'];

  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#0F766E]">{isTamil ? 'செயல்முறை' : 'How It Works'}</h3>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step} className="relative rounded-xl bg-[#F5F7FA] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F766E] font-bold text-white">
                {i + 1}
              </div>
              <p className="mt-3 font-semibold text-[#0F766E]">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeHowItWorks;
