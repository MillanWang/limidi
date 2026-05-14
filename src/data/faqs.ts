export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "What platforms does LiMIDI support?",
    answer:
      "The mobile app runs on iOS (iPhone and iPad). The desktop app currently runs on macOS (Apple Silicon).",
  },
  {
    question: "Which DAWs does it work with?",
    answer:
      "Any DAW on macOS that can receive a standard MIDI input. That includes Logic Pro, Ableton Live, FL Studio, Pro Tools, GarageBand, Reaper, Bitwig, Studio One, and others. LiMIDI shows up to your DAW as a regular MIDI device named 'LiMIDI'.",
  },
  {
    question: "How is the latency?",
    answer:
      "Latency depends on your local network, but on a typical home Wi-Fi network it's low enough to play live with.",
  },
  {
    question: "My phone can't find my Mac. What do I check?",
    answer:
      "Both devices have to be on the same Wi-Fi network. If you have a guest network, work VPN, or 'client isolation' enabled on your router, your phone and Mac may be unable to see each other even though they're on the same SSID. Disable client isolation and any active VPN, then re-scan the QR code.",
  },
  {
    question: "Is LiMIDI free?",
    answer: "Yes. Both the mobile app and the desktop app are free.",
  },
];
