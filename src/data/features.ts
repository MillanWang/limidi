import { Sliders, Music2, Wifi, Zap, type LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  {
    title: "Fully customizable layouts",
    description:
      "Use drum pads, faders, and XY pads anywhere on the screen. Customize them, color them, and map each one to whatever MIDI message your DAW expects.",
    icon: Sliders,
  },
  {
    title: "Works with every macOS DAW",
    description:
      "LiMIDI registers as a standard virtual MIDI device for seamless integration with any macOS DAW, such as Logic Pro, Ableton Live, FL Studio, Pro Tools, GarageBand, Reaper, etc.",
    icon: Music2,
  },
  {
    title: "Wireless pairing over Wi-Fi",
    description:
      "Simply scan the QR code shown on your computer from your mobile device. No cables, no drivers, no accounts, no subscriptions.",
    icon: Wifi,
  },
  {
    title: "Low-latency and free",
    description:
      "Built on a lightweight local network protocol for maximum responsiveness. Free to download and free to use.",
    icon: Zap,
  },
];
