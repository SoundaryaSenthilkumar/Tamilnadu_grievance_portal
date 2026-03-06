import { Link } from 'react-router-dom';

function HomeQuickServices({ isTamil, quickServices }) {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#0F766E]">{isTamil ? 'விரைவு சேவைகள்' : 'Quick Services'}</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickServices.map((service) => {
            const Icon = service.icon;
            const CardWrap = service.to.startsWith('#') ? 'a' : Link;
            const cardProps = service.to.startsWith('#') ? { href: service.to } : { to: service.to };

            return (
              <CardWrap
                key={service.title}
                {...cardProps}
                className="group rounded-xl border border-slate-100 bg-white p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="inline-flex rounded-lg bg-[#0F766E]/10 p-3 text-[#0F766E] group-hover:bg-[#F4B400]/20">
                  <Icon />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-[#0F766E]">{service.title}</h4>
                <p className="mt-2 text-sm text-slate-600">{service.desc}</p>
              </CardWrap>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeQuickServices;
