import { ChevronDown } from "lucide-react";
import { faqs } from "../data/faqs";

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 id="faq-title" className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl bg-white/[0.03] border border-white/10 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] open:border-violet-400/40 open:bg-white/[0.05] open:hover:border-violet-400/55 open:hover:bg-white/[0.08]"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 sm:px-6 py-4 select-none">
                <span className="font-semibold text-white text-base sm:text-lg transition-colors group-hover:text-violet-50">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="flex-shrink-0 text-violet-300 transition-all duration-300 group-hover:text-violet-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 sm:px-6 pb-5 text-gray-300 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
