#!/usr/bin/env bash
# Interactive setup for Wallpaper Switcher. Invoked by install.sh.
set -euo pipefail

echo "Wallpaper Switcher reads images from ~/Pictures/Wallpapers."
mkdir -p "$HOME/Pictures/Wallpapers"
echo "    Ensured ~/Pictures/Wallpapers exists — add some images to it."
echo
echo "Applying a wallpaper uses AppleScript (System Events), which may need"
echo "Automation permission for Übersicht:"
echo "  System Settings → Privacy & Security → Automation → Übersicht → System Events."
printf "Open Automation settings now? [Y/n] "; read -r a
case "$a" in
  n|N) ;;
  *) open "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation" 2>/dev/null || true ;;
esac
