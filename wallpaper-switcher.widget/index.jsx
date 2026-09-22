import { React, run } from "uebersicht";
// --- Inlined design system (self-contained; formerly theme.js) ---
// Shared design system for the widget set: color tokens, fonts, layout, the
// common card shell, drag/resize handles, a last-known-good cache, and the
// standard data-resolution helper. Imported by every widget so they stay
// visually and behaviorally consistent.
const T = {
  // Accent tints
  tintBlue: "#296BE0",
  tintPink: "#E86E87",
  tintGreen: "#59A875",
  tintOrange: "#D9946B",
  tintPurple: "#A861DE",

  // Cards
  cardLight: "rgba(255,255,255,0.74)",
  cardDark: "rgba(33,36,43,0.88)",

  // Ink (text on light)
  ink: "#1F2129",
  inkDim: "#616670",
  inkMute: "#8C919C",

  // Text on dark
  onDark: "#F7F7FA",
  onDarkDim: "#BDBFC7",
  onDarkMute: "#8F949E",

  // Walls (desktop stand-in backgrounds)
  wall1: "#F0F2F7",
  wall2: "#DBE3ED",
  wall3: "#BFC7DB",

  // GitHub ramp
  ghEmpty: "rgba(255,255,255,0.10)",
  ghGreen1: "#9CE8A8",
  ghGreen2: "#40C463",
  ghGreen3: "#30A14F",
  ghGreen4: "#216E38",

  // Scene colors
  nightSky: "#14141A",
  cosmicBase: "#0A051A",
  cosmicViolet: "#8C338C",
  cosmicMagenta: "#D9598C",
  cosmicIndigo: "#331A66",
  shaderPurple: "#402673",
  shaderTeal: "#268C8C",
  duskBase: "#4D408C",
  duskAmber: "#D9A666",
  duskPurple: "#8C4DA6",
  duskGlow: "#F28073",
  cardCream: "#F2F0E6",
  paperGrain: "#9E8052",

  archivePalette: [
    "#D98C4D", "#A64D33", "#733326", "#E0B359",
    "#8C6640", "#B88CCC", "#594D80", "#8C73BF",
    "#8CBF8C", "#4D8059", "#598CD9", "#334D8C",
  ],

  // Layout
  radius: "24px",
  captionTracking: "1.5px",
};

// Fonts. Install Instrument Serif, Geist, and Geist Mono for the intended look;
// each stack falls back to a system font if the family is missing.
const serif = "'Instrument Serif', Georgia, serif";
const sans = "'Geist', -apple-system, BlinkMacSystemFont, sans-serif";
const mono = "'Geist Mono', 'SF Mono', ui-monospace, monospace";

// Default desktop placement [x, y] per widget. Each widget calls
// card(variant, w, h, ...LAYOUT.<key>) so widgets lay out at distinct positions
// rather than stacking at the origin. These are overridden by any saved
// position from the drag handle.
const LAYOUT = {
  nowSpinning:  [380, 40],
  musicArchive: [40, 40],
  spatial:      [380, 200],
  mosaic:       [1120, 40],
  stack:        [1120, 486],
  drop:         [1120, 708],
  swap:         [380, 672],
  aiDailyPull:  [40, 368],
  apod:         [40, 576],
  atlas:        [1280, 224],
  tarot:        [1120, 224],
};

// Shared card shell. variant is "dark" or "light"; x/y set the on-desktop
// position. The common loading/empty/stale state styles are appended so every
// widget can render those states without repeating CSS.
const card = (variant, w, h, x = 0, y = 0) => `
  position: absolute;
  left: ${x}px; top: ${y}px;
  width: ${w}px;
  height: ${h}px;
  border-radius: ${T.radius};
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  background: ${variant === "dark" ? T.cardDark : T.cardLight};
  backdrop-filter: blur(20px);
  color: ${variant === "dark" ? T.onDark : T.ink};
  font-family: ${sans};
  box-sizing: border-box;
  transform-origin: top left;

  /* Promote each card to its own GPU layer so a sibling widget's frequent
     refresh cannot trigger a backdrop-filter recomposite, which otherwise made
     the blur flicker on and off. */
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  .ws-stale { position:absolute; top:8px; right:10px; z-index:5;
              font-family:${mono}; font-size:8px; letter-spacing:1px;
              text-transform:uppercase; opacity:0.72;
              color:${variant === "dark" ? T.onDarkMute : T.inkMute}; }
  .ws-empty { position:absolute; inset:0; display:flex; align-items:center;
              justify-content:center; padding:24px; text-align:center;
              font-family:${serif}; font-style:italic; font-size:18px;
              opacity:0.6; color:${variant === "dark" ? T.onDarkDim : T.inkDim}; }
  .ws-skel  { position:absolute; inset:14px; border-radius:14px; opacity:0.18;
              animation: ws-pulse 1.6s ease-in-out infinite; }
  @keyframes ws-pulse { 0%,100% { opacity:0.10; } 50% { opacity:0.24; } }
  @media (prefers-reduced-motion: reduce) {
    .ws-skel { animation:none; opacity:0.16; }
  }

  .ws-drag  { position:absolute; top:6px; left:6px; z-index:30;
              width:18px; height:18px; border-radius:6px;
              display:flex; align-items:center; justify-content:center;
              font-size:11px; line-height:1; cursor:grab; opacity:0.22;
              transition:opacity .15s ease; user-select:none;
              -webkit-user-select:none;
              color:${variant === "dark" ? T.onDarkMute : T.inkMute};
              background:${variant === "dark"
                ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; }
  .ws-drag:hover  { opacity:0.95; }
  .ws-drag:active { cursor:grabbing; }

  .ws-resize { position:absolute; bottom:5px; right:5px; z-index:30;
               width:16px; height:16px; border-radius:5px;
               display:flex; align-items:center; justify-content:center;
               font-size:11px; line-height:1; cursor:nwse-resize; opacity:0.22;
               transition:opacity .15s ease; user-select:none;
               -webkit-user-select:none;
               color:${variant === "dark" ? T.onDarkMute : T.inkMute};
               background:${variant === "dark"
                 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}; }
  .ws-resize:hover { opacity:0.95; }
`;

// Small uppercase monospace caption used for metadata labels.
const caption = (color) => `
  font-family: ${mono};
  text-transform: uppercase;
  letter-spacing: ${T.captionTracking};
  color: ${color};
`;

// State helpers, returned as React elements (this is plain JS, not JSX).
const h = React.createElement;

// Loading: an accent-tinted skeleton block.
const Skel = ({ tint = T.tintBlue }) =>
  h("div", { className: "ws-skel", style: { background: tint } });

// Empty: a single quiet line of text.
const Empty = ({ text }) => h("div", { className: "ws-empty" }, text);

// Stale: a small marker showing the time of the last successful refresh.
const Stale = ({ ts }) =>
  h("div", { className: "ws-stale" }, `stale · ${clockStamp(ts)}`);

// Drag and resize support.
//
// Übersicht renders each widget into its own absolutely-positioned `.widget`
// node, all inside a shared `#uebersicht` container. The wrapper to move is the
// nearest `.widget` ancestor of a handle — not the topmost absolute element,
// which is the shared container.
//
// DragHandle updates the wrapper's left/top. ResizeHandle scales it uniformly
// via a top-left-anchored CSS transform, keeping these fixed-layout cards crisp
// instead of clipping. Both persist to localStorage, so position and size
// survive refreshes and reboots.
const posKey = (k) => `ws:pos:${k}`;
const scaleKey = (k) => `ws:scale:${k}`;
const MIN_SCALE = 0.4, MAX_SCALE = 3;

const findWrapper = (node) => node && node.closest(".widget");

// Apply any saved position and scale. Runs on every mount, since the wrapper
// may have been recreated on refresh.
const applySaved = (wrapper, key) => {
  try {
    const pos = JSON.parse(localStorage.getItem(posKey(key)) || "null");
    if (pos && typeof pos.x === "number") {
      wrapper.style.left = pos.x + "px";
      wrapper.style.top = pos.y + "px";
    }
  } catch (e) { /* storage unavailable */ }
  try {
    const scale = parseFloat(localStorage.getItem(scaleKey(key)));
    if (scale > 0) wrapper.style.transform = `scale(${scale})`;
  } catch (e) { /* storage unavailable */ }
};

const initDrag = (node, key) => {
  if (!node) return;
  const wrapper = findWrapper(node);
  if (!wrapper) return;
  applySaved(wrapper, key);

  if (node.__wsDragWired) return; // attach listeners once per node
  node.__wsDragWired = true;

  // Keep grip clicks from reaching the card's own onClick handler.
  node.addEventListener("click", (e) => e.stopPropagation());

  node.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const cs = getComputedStyle(wrapper);
    const origX = parseFloat(wrapper.style.left || cs.left) || 0;
    const origY = parseFloat(wrapper.style.top || cs.top) || 0;
    const onMove = (ev) => {
      wrapper.style.left = origX + (ev.clientX - startX) + "px";
      wrapper.style.top = origY + (ev.clientY - startY) + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      try {
        localStorage.setItem(posKey(key), JSON.stringify({
          x: parseFloat(wrapper.style.left) || 0,
          y: parseFloat(wrapper.style.top) || 0,
        }));
      } catch (e) { /* storage unavailable */ }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Double-click the grip to snap back to the card's default LAYOUT slot.
  node.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.removeItem(posKey(key)); } catch (e) { /* ignore */ }
    wrapper.style.left = "";
    wrapper.style.top = "";
  });
};

const initResize = (node, key) => {
  if (!node) return;
  const wrapper = findWrapper(node);
  if (!wrapper) return;
  applySaved(wrapper, key);

  if (node.__wsResizeWired) return;
  node.__wsResizeWired = true;

  node.addEventListener("click", (e) => e.stopPropagation());

  node.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const cs = getComputedStyle(wrapper);
    // Layout width/height are unaffected by transform, so they stay constant.
    const baseW = parseFloat(cs.width) || 1;
    const baseH = parseFloat(cs.height) || 1;
    const m = /scale\(([^)]+)\)/.exec(wrapper.style.transform || "");
    const origScale = m ? parseFloat(m[1]) || 1 : 1;
    const onMove = (ev) => {
      const delta = (ev.clientX - startX + (ev.clientY - startY)) / (baseW + baseH);
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, origScale + delta));
      wrapper.style.transform = `scale(${next})`;
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const m2 = /scale\(([^)]+)\)/.exec(wrapper.style.transform || "");
      try { localStorage.setItem(scaleKey(key), String(m2 ? m2[1] : 1)); }
      catch (e) { /* storage unavailable */ }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  // Double-click the corner to restore the card's default size.
  node.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    try { localStorage.removeItem(scaleKey(key)); } catch (e) { /* ignore */ }
    wrapper.style.transform = "";
  });
};

// Each handle takes the widget's LAYOUT key so position and scale are stored
// per widget. DragHandle renders top-left, ResizeHandle bottom-right.
const DragHandle = ({ k }) =>
  h("div", { className: "ws-drag", title: "Drag to move · double-click to reset",
             ref: (n) => initDrag(n, k) }, "☰");

const ResizeHandle = ({ k }) =>
  h("div", { className: "ws-resize", title: "Drag to resize · double-click to reset",
             ref: (n) => initResize(n, k) }, "⤡");

// Last-known-good cache, persisted in localStorage with a timestamp.
const remember = (key, data) => {
  try { localStorage.setItem(`ws:${key}`, JSON.stringify({ data, ts: Date.now() })); }
  catch (e) { /* storage unavailable; skip */ }
};

const recall = (key) => {
  try { return JSON.parse(localStorage.getItem(`ws:${key}`)); }
  catch (e) { return null; }
};

const clockStamp = (ms) =>
  new Date(ms).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// True before the command has produced any output (the initial load tick).
const isLoading = ({ output, error }) =>
  output === undefined && !error;

// Standard data flow for command-backed widgets. parse(output) must return a
// falsy value when there is nothing usable.
//   loading -> { loading: true }            render <Skel/>
//   success -> { data }                     cached as last-known-good
//   failure -> { data, staleTs }            last-known-good + time, render <Stale/>
//   cold    -> { data, mock: true }         mock data, nothing cached yet
const resolve = (key, props, parse, mock) => {
  if (isLoading(props)) return { loading: true };
  let data = null;
  try { data = parse(props.output); } catch (e) { data = null; }
  if (data) { remember(key, data); return { data }; }
  const cached = recall(key);
  if (cached && cached.data) return { data: cached.data, staleTs: cached.ts };
  return { data: mock, mock: true };
};
// --- End inlined design system ---

// A wallpaper browser and setter, reading images from ~/Pictures/Wallpapers.
//
// Übersicht serves widgets over HTTP, so file:// images are blocked. The
// command instead renders each wallpaper to a small JPEG with sips (cached by a
// path hash) and emits them all as base64 data URIs in one pass. Navigation
// then swaps the preview entirely in the DOM, with no shell round-trip, and
// clicking the preview sets it as the desktop picture on every display. With no
// wallpaper folder, a layered gradient stand-in is shown.
export const command =
  `DIR="$HOME/Pictures/Wallpapers"; US=$(printf '\\037'); RS=$(printf '\\036'); ` +
  `FILES=$(find "$DIR" -maxdepth 1 -type f ` +
    `\\( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.heic' \\) 2>/dev/null | sort); ` +
  `if [ -z "$FILES" ]; then echo ""; exit 0; fi; ` +
  `printf '%s\\n' "$FILES" | while IFS= read -r f; do ` +
    `KEY=$(printf '%s' "$f" | md5 -q 2>/dev/null); ` +
    `THUMB="$HOME/Library/Caches/ws-swap-$KEY.jpg"; ` +
    `[ -s "$THUMB" ] || sips -Z 360 "$f" --out "$THUMB" >/dev/null 2>&1; ` +
    `DATA="data:image/jpeg;base64,$(base64 -i "$THUMB" 2>/dev/null | tr -d '\\n')"; ` +
    `printf '%s%s%s%s%s%s' "$(basename "$f")" "$US" "$f" "$US" "$DATA" "$RS"; ` +
  `done`;

export const refreshFrequency = 1000 * 60 * 5; // navigation is client-side; only re-scan for added/removed wallpapers

export const className = card("light", 220, 220, ...LAYOUT.swap) + `
  padding: 0;
  .bg    { position:absolute; inset:0; background:
             radial-gradient(130px at 100% 0%,  ${T.duskAmber},  transparent),
             radial-gradient(150px at 0% 100%,  ${T.duskPurple}, transparent),
             radial-gradient(80px  at 68% 42%, rgba(242,128,115,0.7), transparent),
             ${T.duskBase}; }
  .img   { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .scrim { position:absolute; inset:0; pointer-events:none;
           background:linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 25%,
                       transparent 70%, rgba(0,0,0,0.4)); }
  .row   { position:absolute; left:14px; right:14px; bottom:14px;
           display:flex; align-items:center; justify-content:space-between; gap:8px; }
  .nav   { min-width:40px; min-height:40px; display:flex; align-items:center;
           justify-content:center; cursor:pointer; color:rgba(255,255,255,0.92);
           font-size:22px; line-height:1; user-select:none;
           text-shadow:0 0.5px 2px rgba(0,0,0,0.6); }
  .pips  { display:flex; gap:4px; }
  .pip   { width:4px; height:4px; border-radius:50%; }
  .count { font-family:${serif}; font-style:italic; font-size:11px; color:#fff;
           text-shadow:0 0.5px 2px rgba(0,0,0,0.6); }
`;

const RS = String.fromCharCode(30);
const US = String.fromCharCode(31);

const MOCK = [
  { name: "DUSK / 01", path: null, data: null },
  { name: "DUSK / 02", path: null, data: null },
  { name: "DUSK / 03", path: null, data: null },
  { name: "DUSK / 04", path: null, data: null },
];

const niceName = (n) =>
  n.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim().toUpperCase();

const parse = (output) => {
  const raw = (output || "").trim();
  if (!raw) return null;
  const items = raw.split(RS).map((rec) => {
    const f = rec.split(US);
    if (f.length < 3 || !f[2]) return null;
    return { name: niceName(f[0]), path: f[1], data: f[2] };
  }).filter(Boolean);
  return items.length ? items : null;
};

const esc = (s) => s.replace(/'/g, "'\\''");

// Wallpapers from the latest render, so click handlers (which fire between
// refreshes) can read them. The selected index persists in localStorage.
let ITEMS = [];
const KEY = "ws:swap:idx";
const clampIdx = (i) =>
  ITEMS.length ? ((i % ITEMS.length) + ITEMS.length) % ITEMS.length : 0;
const getIdx = () => clampIdx(parseInt(localStorage.getItem(KEY) || "0", 10) || 0);

// Repaint the preview directly in the DOM; instant, with no command re-run.
const paint = (idx) => {
  const it = ITEMS[idx];
  if (!it) return;
  const img = document.getElementById("ws-swap-img");
  if (img && it.data) img.src = it.data;
  const pips = document.getElementById("ws-swap-pips");
  if (pips) Array.from(pips.children).forEach((p, i) => {
    p.style.background = `rgba(255,255,255,${i === idx ? 0.95 : 0.4})`;
  });
  const cnt = document.getElementById("ws-swap-count");
  if (cnt) cnt.textContent = `${idx + 1} / ${ITEMS.length}`;
  const root = document.getElementById("ws-swap-root");
  if (root) root.setAttribute("aria-label", `Wallpaper ${idx + 1} of ${ITEMS.length}: ${it.name}`);
};

// Step the preview only (-1 back, +1 forward); the desktop is left untouched.
const step = (delta) => (e) => {
  if (e && e.stopPropagation) e.stopPropagation();
  const next = clampIdx(getIdx() + delta);
  try { localStorage.setItem(KEY, String(next)); } catch (err) {}
  paint(next);
};

// Set the desktop picture on every display to the currently previewed image.
const apply = (e) => {
  if (e && e.stopPropagation) e.stopPropagation();
  const it = ITEMS[getIdx()];
  if (!it || !it.path) return;
  run(`osascript -e 'tell application "System Events" to set picture of every desktop to "${esc(it.path)}"'`);
};

export const render = (props) => {
  if (isLoading(props)) return <Skel tint={T.duskPurple} />;
  ITEMS = parse(props.output) || MOCK;
  const idx = getIdx();
  const it = ITEMS[idx];
  const total = ITEMS.length;

  return (
    <div id="ws-swap-root" aria-label={`Wallpaper ${idx + 1} of ${total}: ${it.name}`}>
      <DragHandle k="swap" />
      <ResizeHandle k="swap" />
      {it.data
        ? <img id="ws-swap-img" className="img" src={it.data} onClick={apply} style={{ cursor: "pointer" }} />
        : <div className="bg" />}
      <div className="scrim" />
      <div className="row">
        <span className="nav" title="Previous wallpaper" onClick={step(-1)}>&#x2039;</span>
        {total <= 8
          ? <span id="ws-swap-pips" className="pips">
              {Array.from({ length: total }, (_, i) => (
                <span key={i} className="pip"
                  style={{ background: `rgba(255,255,255,${i === idx ? 0.95 : 0.4})` }} />
              ))}
            </span>
          : <span id="ws-swap-count" className="count">{idx + 1} / {total}</span>}
        <span className="nav" title="Next wallpaper" onClick={step(1)}>&#x203A;</span>
      </div>
    </div>
  );
};
