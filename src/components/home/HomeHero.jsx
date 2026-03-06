import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomeHero({ isTamil, slideImages }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const sliderTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 3000);

    return () => clearInterval(sliderTimer);
  }, [slideImages.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F4B400]/15 blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="max-w-3xl lg:col-span-7">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {isTamil ? 'பொதுமக்கள் குறைதீர் அமைப்பு' : 'Public Grievance Redressal System'}
            </h2>
            <p className="mt-4 text-base text-slate-100 sm:text-lg">
              {isTamil
                ? 'மக்கள் ஆன்லைனில் புகார் அளித்து, நேரடி முன்னேற்றத்தை கண்காணித்து, துறைகளில் இருந்து வெளிப்படையான புதுப்பிப்புகளை பெறலாம்.'
                : 'Citizens can submit complaints online, track progress in real time, and receive transparent updates from concerned departments.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/raise-complaint"
                className="rounded-lg bg-[#F4B400] px-6 py-3 font-semibold text-[#0F766E] shadow transition hover:scale-[1.02] hover:shadow-lg"
              >
                {isTamil ? 'புகார் பதிவு' : 'Raise Complaint'}
              </Link>
              <Link
                to="/track-complaint"
                className="rounded-lg border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-[#0F766E]"
              >
                {isTamil ? 'புகார் கண்காணிப்பு' : 'Track Complaint'}
              </Link>
            </div>

            <div className="mt-8 rounded-xl bg-white/95 p-3 shadow-lg sm:p-4">
              <label className="mb-2 block text-xs font-semibold text-[#0F766E] sm:text-sm">
                {isTamil ? 'உங்கள் புகாரை கண்காணிக்கவும்' : 'Track your complaint'}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  placeholder={
                    isTamil
                      ? 'புகார் ஐடி உள்ளிடவும் (உதா., TNPGR-2026-001245)'
                      : 'Enter complaint ID (e.g., TNPGR-2026-001245)'
                  }
                  className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
                <Link
                  to="/track-complaint"
                  className="rounded-md bg-[#0F766E] px-5 py-2 text-center font-semibold text-white transition hover:bg-[#115E59]"
                >
                  {isTamil ? 'தேடு' : 'Search'}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="relative h-[420px] overflow-hidden rounded-2xl border border-white/20 bg-[#0b5f58]/40 shadow-2xl">
              {slideImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt="Tamil Nadu public service"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    currentSlide === index ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {slideImages.map((image, index) => (
                  <span
                    key={`${image}-${index}`}
                    className={`h-2.5 w-2.5 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/45'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
