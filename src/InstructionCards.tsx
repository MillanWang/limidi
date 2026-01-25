interface InstructionStep {
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  note?: string;
  useImageBadge?: boolean;
  badgeImageSrc?: string;
  badgeImageAlt?: string;
}

const steps: InstructionStep[] = [
  {
    title: "Download the LiMIDI Mobile App",
    description:
      "Get started by downloading the LiMIDI mobile app on your iOS or Android device. The mobile app serves as your MIDI controller interface.",
    link: "https://example.com/limidi-mobile",
    linkText: "Download Mobile App (iOS)",
    useImageBadge: true,
    badgeImageSrc: "/assets/download-on-the-app-store-apple-badge.svg",
    badgeImageAlt: "Download on the App Store",
  },
  {
    title: "Download the LiMIDI Desktop App",
    description:
      "Download the LiMIDI desktop application to your Mac computer. This app acts as a bridge between your mobile device and your Digital Audio Workstation (DAW).",
    link: "https://example.com/limidi-desktop",
    linkText: "Download desktop app (MacOS)",
  },
  {
    title: "Start the LiMIDI Desktop App",
    description:
      "Launch the LiMIDI desktop application on your Mac. Once started, the app will display a QR code that you'll use to connect your mobile device.",
  },
  {
    title: "Enable LiMIDI in Your DAW",
    description:
      "Open your Digital Audio Workstation (DAW) such as FL Studio, Logic, Ableton, Pro Tools, or any other MIDI-compatible software. Navigate to your DAW's MIDI input settings and enable 'LiMIDI' as a MIDI input device.",
  },
  {
    title: "Connect Your Mobile Device",
    description:
      "Open the LiMIDI mobile app on your mobile device. Use the app's QR code scanner to scan the QR code displayed in the desktop app.",
    note: "Important: Both devices must be on the same Wi-Fi network.",
  },
  {
    title: "Enjoy",
    description:
      "You're all set! Your mobile device is now connected to your DAW through LiMIDI. Start creating music and controlling your DAW from your mobile device.",
  },
];

export function InstructionCards() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-lg border border-gray-600">
              {i + 1}
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white">{step.title}</h2>
              <p className="text-gray-300 leading-relaxed">{step.description}</p>
              {step.note && <p className="text-sm text-amber-400 italic">{step.note}</p>}
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  {step.useImageBadge && step.badgeImageSrc ? (
                    <img
                      src={step.badgeImageSrc}
                      alt={step.badgeImageAlt || "Download badge"}
                      className="h-11 w-auto select-none transition-opacity hover:opacity-80 active:opacity-70"
                      draggable={false}
                    />
                  ) : (
                    step.linkText && (
                      <span className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-md transition-colors duration-200 text-sm font-medium">
                        {step.linkText}
                      </span>
                    )
                  )}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
