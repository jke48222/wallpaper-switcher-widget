# wallpaper-switcher

> Browse and set your desktop wallpaper from a photographer's light table of 35 mm slides.

[![Release](https://img.shields.io/github/v/release/jke48222/wallpaper-switcher-widget?label=release)](https://github.com/jke48222/wallpaper-switcher-widget/releases/latest) [![License: MIT](https://img.shields.io/github/license/jke48222/wallpaper-switcher-widget)](LICENSE) ![Platform: macOS](https://img.shields.io/badge/platform-macOS-lightgrey)

[Übersicht gallery](https://tracesof.net/uebersicht-widgets/) · [Widget suite](https://github.com/jke48222/widget-suite) · [Download](https://github.com/jke48222/wallpaper-switcher-widget/releases/latest) · [Setup guide](docs/SETUP.md) · [Troubleshooting](docs/TROUBLESHOOTING.md)

A self-contained widget for [Übersicht](http://tracesof.net/uebersicht/). The
entire widget lives in `index.jsx` (the shared design system is inlined), so it
runs on any Mac with no extra files beyond the bundled assets.

![screenshot](media/screenshot.png)

A photographer's light table: a brushed aluminium frame around a glowing acrylic top, the chosen wallpaper in a cardboard 35 mm slide mount, the rest as small mounts along the bottom. Buttons step, click a mount to select it, click the big slide to set it as the desktop picture. Typeface: Courier Prime. All fonts are under the SIL Open Font License; see `wallpaper-switcher.widget/fonts/OFL.txt`.

## Before and after

![Before and after](media/before-after.png)

### On the desktop

The widget running alongside the full set:

![The Übersicht widget suite composed on one desktop](https://raw.githubusercontent.com/jke48222/widget-suite/main/homescreen.png)

## Requirements

- macOS with [Übersicht](https://tracesof.net/uebersicht/) installed (`brew install --cask ubersicht`)

## Install

If you don't have Übersicht yet:

```sh
brew install --cask ubersicht
```

**One-click.** Clone the repo and run the installer. It copies the widget into Übersicht's widgets folder, installs any helper scripts, and runs setup if the widget needs it. Safe to re-run.

```sh
git clone https://github.com/jke48222/wallpaper-switcher-widget.git
cd wallpaper-switcher-widget && ./install.sh
```

**Manual.** Download `wallpaper-switcher.widget.zip` from the [latest release](https://github.com/jke48222/wallpaper-switcher-widget/releases/latest), unzip it, and put the `wallpaper-switcher.widget` folder in `~/Library/Application Support/Übersicht/widgets/`. Then refresh Übersicht (menu bar icon → Refresh All).

Blank widget? Run `./check.sh` for a pass/fail diagnosis, or see [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md).

## Notes

- Reads images from ~/Pictures/Wallpapers; sets the picture on every display.
- Optional: install the Instrument Serif and Geist font families for the intended typography; system fonts are used as a fallback.

## Customization

Change the DIR path in the command string in index.jsx to use a different folder.

All visual styling (colors, fonts, the card shell, drag/resize handles) is in
the inlined design-system block at the top of `index.jsx`.

## Bundled files

- `index.jsx`
- `install.sh` / `install.command` — one-click installer (copies the widget into Übersicht and installs any helpers)
- `check.sh` — read-only setup diagnostics; prints pass/fail per item

## Related widgets

Part of the [Übersicht Widget Suite](https://github.com/jke48222/widget-suite): 16 widgets that share one design system.

- [Agent Fleet](https://github.com/jke48222/agent-fleet-widget)
- [Animated Wallpaper](https://github.com/jke48222/animated-wallpaper-widget)
- [Clipboard History](https://github.com/jke48222/clipboard-history-widget)
- [Daily AI Prompt](https://github.com/jke48222/daily-ai-prompt-widget)
- [Daily Astronomy Photo](https://github.com/jke48222/daily-astronomy-photo-widget)
- [Daily Tarot](https://github.com/jke48222/daily-tarot-widget)
- [GitHub Contributions](https://github.com/jke48222/github-contributions-widget)
- [Keys & Pads](https://github.com/jke48222/keys-and-pads-widget)
- [Now Playing](https://github.com/jke48222/now-playing-widget)
- [Pi Fleet](https://github.com/jke48222/pi-fleet-widget)
- [Recent Album Covers](https://github.com/jke48222/recent-album-covers-widget)
- [Recent Downloads](https://github.com/jke48222/recent-downloads-widget)
- [Rotating 3D Model](https://github.com/jke48222/rotating-3d-model-widget)
- [Spinning Globe](https://github.com/jke48222/spinning-globe-widget)
- [Window Pet](https://github.com/jke48222/window-pet-widget)

## License

MIT. See [LICENSE](LICENSE).

## Author

Jalen Edusei <jalen.edusei@gmail.com>
