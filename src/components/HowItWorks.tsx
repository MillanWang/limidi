import { ExternalLink } from "lucide-react";
import { steps } from "../data/steps";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            How it works
          </h2>
        </div>

        <ol className="relative space-y-5">
          <span
            aria-hidden="true"
            className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-violet-400/60 via-violet-400/15 to-transparent"
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative pl-14 sm:pl-16 group">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-white text-sm font-bold border border-violet-400/60 shadow-lg shadow-violet-900/40"
                >
                  {i + 1}
                </span>

                <div className="rounded-2xl p-5 sm:p-6 bg-white/[0.03] border border-white/10 group-hover:border-violet-400/40 group-hover:bg-white/[0.05] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-400/20 text-violet-200">
                      <Icon size={20} aria-hidden="true" />
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{step.description}</p>
                      {step.note && <p className="text-sm text-amber-300/90 italic">{step.note}</p>}
                      {step.link && (
                        <div className="pt-1">
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2"
                            aria-label={
                              step.useAppStoreBadge
                                ? step.comingSoon
                                  ? "Download on the App Store (coming soon)"
                                  : "Download on the App Store"
                                : step.linkText
                            }
                          >
                            {step.useAppStoreBadge ? (
                              <span className="relative inline-block">
                                <img
                                  src={`${import.meta.env.BASE_URL}assets/download-on-the-app-store-apple-badge.svg`}
                                  alt=""
                                  className="h-11 w-auto select-none transition-opacity hover:opacity-80 active:opacity-70"
                                  draggable={false}
                                />
                                {step.comingSoon && (
                                  <span className="absolute -top-2 -right-2 text-[10px] font-semibold tracking-wide uppercase bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md shadow">
                                    Soon
                                  </span>
                                )}
                              </span>
                            ) : (
                              step.linkText && (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-400/30 hover:border-violet-300/60 text-violet-100 rounded-lg transition-all duration-200 text-sm font-medium">
                                  {step.linkText}
                                  <ExternalLink size={14} aria-hidden="true" />
                                </span>
                              )
                            )}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
