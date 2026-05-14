export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0a0a12]/70 border-b border-white/5">
      <nav
        aria-label="Primary"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between"
      >
        <a href="#top" className="flex items-center gap-2 group">
          <img
            src={`${import.meta.env.BASE_URL}assets/icon.svg`}
            alt=""
            aria-hidden="true"
            className="h-7 w-7 rounded-md"
          />
          <span className="text-white font-bold text-lg tracking-tight group-hover:text-violet-300 transition-colors">
            LiMIDI
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#how-it-works"
            className="hidden sm:inline-block text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md"
          >
            How it works
          </a>
          <a
            href="#faq"
            className="hidden sm:inline-block text-sm text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md"
          >
            FAQ
          </a>
        </div>
      </nav>
    </header>
  );
}
