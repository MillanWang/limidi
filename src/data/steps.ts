import {
  Smartphone,
  MonitorDown,
  Power,
  Sliders,
  QrCode,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { links } from "./links";

export interface InstructionStep {
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
  linkText?: string;
  note?: string;
  useAppStoreBadge?: boolean;
  comingSoon?: boolean;
}

export const steps: InstructionStep[] = [
  {
    title: "Download the LiMIDI mobile app",
    description:
      "Install the LiMIDI mobile app on iOS device. This is the touch surface you'll customize with your own drum pads, faders, and XY pads.",
    icon: Smartphone,
    link: links.iosAppStore.url,
    useAppStoreBadge: true,
    comingSoon: links.iosAppStore.comingSoon,
  },
  {
    title: "Download the LiMIDI desktop app",
    description:
      "Install the LiMIDI desktop app on your Mac. It receives MIDI signals from your phone over Wi-Fi and forwards it to any DAW on your machine as a virtual MIDI device.",
    icon: MonitorDown,
    link: links.macDesktopDownload,
    linkText: "Download for macOS (Apple Silicon)",
  },
  {
    title: "Launch the desktop app",
    description:
      "Open the LiMIDI desktop app. It will display a QR code that pairs your phone with your Mac when connected to the same Wi-Fi network.",
    icon: Power,
  },
  {
    title: "Enable LiMIDI in your DAW",
    description:
      "Open your DAW — Logic Pro, Ableton Live, FL Studio, GarageBand, Pro Tools, Reaper, or anything else that accepts MIDI — and select 'LiMIDI' as a MIDI input device.",
    icon: Sliders,
  },
  {
    title: "Connect your phone",
    description: "Open the LiMIDI mobile app and scan the QR code shown on your Mac.",
    icon: QrCode,
    note: "Both devices must be on the same Wi-Fi network.",
  },
  {
    title: "Start playing",
    description:
      "Design a layout for the track you're working on, map every control to whatever you want, and play. Your device is now a full MIDI controller for your DAW.",
    icon: Sparkles,
  },
];
