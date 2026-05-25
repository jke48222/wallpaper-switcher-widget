# wallpaper-switcher — Setup

> Browse and apply desktop wallpapers from a folder.

## Install (one click)

1. Install [Übersicht](https://tracesof.net/uebersicht/) and run it once.
2. Double-click `install.command` (or run `./install.sh` in Terminal).
   It copies `wallpaper-switcher.widget` into your Übersicht widgets folder, installs any
   helpers, and walks you through any configuration.

The installer is safe to re-run; it just refreshes the install in place.
To install by hand instead, unzip `wallpaper-switcher.widget.zip` into
`~/Library/Application Support/Übersicht/widgets/`.

## Configuration

Put images in `~/Pictures/Wallpapers` (or edit the folder at the top of
`index.jsx`). Applying a wallpaper uses AppleScript, which may require
**Automation permission** for Übersicht to control System Events.

## Fonts

For the intended look, install **Instrument Serif**, **Geist**, and
**Geist Mono**. System fonts are used as a fallback otherwise.
