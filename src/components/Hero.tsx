import { Apple, Download } from "lucide-react";
import { links } from "../data/links";
import { PhoneMockup } from "./PhoneMockup";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
        <div
          className="blob"
          style={{
            width: 380,
            height: 380,
            background: "#a855f7",
            top: -80,
            left: -60,
          }}
        />
        <div
          className="blob"
          style={{
            width: 320,
            height: 320,
            background: "#22d3ee",
            top: 80,
            right: -80,
            animationDelay: "-4s",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="fade-up text-center lg:text-left">
            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-6"
            >
              Your iPhone is now a{" "}
              <span className="brand-gradient-text">customizable MIDI controller</span> for your
              DAW.
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              LiMIDI lets you design your own layout of pads, faders, and XY pads on your phone,
              then plays it wirelessly into Logic, Ableton, FL Studio, Pro Tools, or any other macOS
              DAW.
            </p>

            <div
              id="download"
              className="flex flex-col sm:flex-row gap-3 items-center lg:items-start justify-center lg:justify-start mb-6"
            >
              <a
                href={links.iosAppStore.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block"
                aria-label={
                  links.iosAppStore.comingSoon
                    ? "Download on the App Store (coming soon)"
                    : "Download on the App Store"
                }
              >
                <img
                  src={`${import.meta.env.BASE_URL}assets/download-on-the-app-store-apple-badge.svg`}
                  alt=""
                  className="h-12 w-auto select-none transition-opacity hover:opacity-80"
                  draggable={false}
                />
                {links.iosAppStore.comingSoon && (
                  <span className="absolute -top-2 -right-2 text-[10px] font-semibold tracking-wide uppercase bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md shadow">
                    Soon
                  </span>
                )}
              </a>

              <a
                href={links.macDesktopDownload}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-cta inline-flex items-center gap-2 text-white font-semibold px-5 py-3 rounded-xl h-12"
              >
                <Apple size={18} aria-hidden="true" />
                Download for macOS
                <Download size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="fade-up flex justify-center lg:justify-end">
            <div className="relative">
              <PhoneMockup className="w-[340px] sm:w-[400px] h-auto drop-shadow-[0_25px_60px_rgba(168,85,247,0.25)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
