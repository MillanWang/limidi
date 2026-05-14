export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
        <div className="flex items-center gap-3 text-gray-300">
          <img
            src={`${import.meta.env.BASE_URL}assets/icon.svg`}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 rounded"
          />
          <span className="text-white font-semibold">LiMIDI</span>
        </div>
        <p className="text-gray-500">2026</p>
      </div>
    </footer>
  );
}
