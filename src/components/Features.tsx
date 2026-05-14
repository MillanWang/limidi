import { features } from "../data/features";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2
            id="features-title"
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            A MIDI controller that's exactly what you want it to be.
          </h2>
        </div>

        <ul className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.title}
                className="group relative rounded-2xl p-6 bg-white/[0.03] border border-white/10 hover:border-violet-400/40 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div
                  className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 0%, rgba(168,85,247,0.18), transparent 70%)",
                  }}
                  aria-hidden="true"
                />
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 border border-violet-400/30 text-violet-200 mb-4">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{f.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
