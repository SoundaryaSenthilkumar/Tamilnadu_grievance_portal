function HomeDepartments({ isTamil, departments }) {
  return (
    <section id="departments" className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-[#0F766E]">{isTamil ? 'துறைகள்' : 'Departments'}</h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <a
              key={dept.name}
              href={dept.href}
              className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#2f7f90] hover:bg-[#2f7f90] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2f7f90] focus:ring-offset-2"
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-transform duration-300 group-hover:scale-110">
                *
              </span>
              <span className="block px-8 text-center text-base font-semibold text-[#0F766E] transition-colors group-hover:text-white">
                {dept.name}
              </span>
              <span className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-bl-2xl bg-[#2f7f90] text-sm font-bold text-white transition-colors group-hover:bg-[#0F766E]">
                -&gt;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeDepartments;
