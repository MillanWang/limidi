// Central place for all external links shown on the site.
// When the iOS app ships, set `iosAppStore.comingSoon` to false and update `url`.
export const links = {
  github: "https://github.com/MillanWang/LiMIDI",
  iosAppStore: {
    url: "https://example.com/limidi-mobile",
    comingSoon: true,
  },
  /** GitHub release tag page (pick the desktop asset to download). */
  macDesktopDownload:
    "https://github.com/MillanWang/LiMIDI/releases/download/LiMIDI-v1.0.0/LiMIDI.dmg",
  macDesktopReleases: "https://github.com/MillanWang/LiMIDI/releases",
} as const;
