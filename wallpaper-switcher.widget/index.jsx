import { React } from "uebersicht";
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
              font-size:11px; line-height:1; cursor:grab; opacity:0.42;
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
               font-size:11px; line-height:1; cursor:nwse-resize; opacity:0.42;
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

const FONTS = "wallpaper-switcher.widget/fonts";
// A lightbox: a pale aluminium frame around a glowing glass top, the chosen
// wallpaper mounted as a slide, and a 35 mm filmstrip of every wallpaper
// across the bottom with sprocket holes and edge printing. Click a frame to
// preview it, the slide to set it as the desktop on every display.
export const className = card("light", 280, 250, ...LAYOUT.swap) + `
  @font-face { font-family: "Barlow Condensed"; src: url("${FONTS}/BarlowCondensed-600.woff2") format("woff2"); font-weight: 600; }
  --cond: "Barlow Condensed", "Arial Narrow", sans-serif;
  padding: 12px; border-radius: 10px; backdrop-filter: none; overflow: hidden; user-select:none; -webkit-user-select:none;
  background: linear-gradient(180deg, #F1F0EB 0%, #DCDAD3 100%);
  box-shadow: 0 26px 50px rgba(0,0,0,0.5), inset 0 1px 0 #fff, inset 0 -2px 0 rgba(0,0,0,0.12), 0 0 0 1px #b9b7b0;
  &::before { content:""; position:absolute; inset:0; pointer-events:none; opacity: 0.6; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 1px, rgba(0,0,0,0) 1px 3px); }
  .ws-drag { top: 4px; left: 4px; color:#777; background: rgba(0,0,0,0.05); } .ws-resize { bottom: 3px; right: 3px; color:#777; background: rgba(0,0,0,0.05); }
  .glass { position:relative; height: 150px; border-radius: 6px; background: radial-gradient(180px 90px at 50% 40%, #FFFFFF 0%, #F4F3EE 60%, #E4E2DB 100%);
           box-shadow: inset 0 0 0 1px #c9c7c0, inset 0 2px 8px rgba(0,0,0,0.12), 0 0 14px rgba(255,255,255,0.7); display:flex; align-items:center; justify-content:center; }
  .slide { position:relative; width: 200px; height: 126px; background: #F7F6F1; border-radius: 3px; box-shadow: 0 6px 14px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08); padding: 8px 10px; cursor:pointer; }
  .slide .img { width: 100%; height: 100%; object-fit: cover; display:block; background: #222; }
  .slide .bg { width:100%; height:100%; background: radial-gradient(130px at 100% 0%, ${T.duskAmber}, transparent), radial-gradient(150px at 0% 100%, ${T.duskPurple}, transparent), ${T.duskBase}; }
  .slide .n { position:absolute; left: 12px; bottom: -1px; font: 600 7px/1 var(--cond); letter-spacing: 1.4px; color:#8A8378; text-transform:uppercase; }
  .film { position:relative; margin-top: 10px; height: 58px; border-radius: 2px; background: #171717; box-shadow: inset 0 0 0 1px #000, 0 2px 4px rgba(0,0,0,0.3); overflow:hidden; }
  .film::before, .film::after { content:""; position:absolute; left:0; right:0; height: 6px; background: radial-gradient(3px 2.5px at 6px 50%, #DCDAD3 95%, transparent 100%) 0 0 / 12px 6px repeat-x; }
  .film::before { top: 3px; } .film::after { bottom: 3px; }
  .frames { position:absolute; left: 0; top: 11px; height: 36px; display:flex; gap: 4px; padding: 0 6px; transition: transform .25s ease; }
  .frame { width: 52px; height: 36px; flex:none; background-size:cover; background-position:center; background-color:#3a3a3a; cursor:pointer; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08); }
  .frame.on { box-shadow: 0 0 0 2px #F5561E, inset 0 0 0 1px rgba(255,255,255,0.3); }
  .edge { position:absolute; left: 8px; bottom: 0px; font: 600 5.5px/6px var(--cond); letter-spacing: 1.6px; color: #8a7a4a; text-transform:uppercase; white-space:nowrap; }
  .nav { position:absolute; top: 60px; width: 26px; height: 26px; border-radius: 50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#3a3a3a; font-size: 16px; line-height:1;
         background: linear-gradient(180deg, #FDFDFB, #E4E2DB); box-shadow: 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 #fff; }
  .nav.prev { left: 16px; } .nav.next { right: 16px; }
  .count { position:absolute; right: 14px; top: 4px; font: 600 7.5px/1 var(--cond); letter-spacing: 1.6px; color:#8A8378; text-transform:uppercase; }
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

const strip = () => document.getElementById("ws-swap-strip");
const paint = (idx) => {
  const it = ITEMS[idx]; if (!it) return;
  const img = document.getElementById("ws-swap-img"); if (img && it.data) img.src = it.data;
  const s = strip(); if (s) { Array.from(s.children).forEach((f, i) => f.classList.toggle("on", i === idx)); s.style.transform = `translateX(${Math.max(-(ITEMS.length * 56 - 244), Math.min(0, 100 - idx * 56))}px)`; }
  const cnt = document.getElementById("ws-swap-count"); if (cnt) cnt.textContent = `Frame ${idx + 1} / ${ITEMS.length}`;
  const nm = document.getElementById("ws-swap-name"); if (nm) nm.textContent = it.name;
};
const step = (delta) => (e) => { if (e && e.stopPropagation) e.stopPropagation(); const next = clampIdx(getIdx() + delta); try { localStorage.setItem(KEY, String(next)); } catch (err) {} paint(next); };
const pick = (i) => (e) => { if (e && e.stopPropagation) e.stopPropagation(); try { localStorage.setItem(KEY, String(clampIdx(i))); } catch (err) {} paint(clampIdx(i)); };
const apply = (e) => { if (e && e.stopPropagation) e.stopPropagation(); const it = ITEMS[getIdx()]; if (!it || !it.path) return; run(`osascript -e 'tell application "System Events" to set picture of every desktop to "${esc(it.path)}"'`); };
export const render = (props) => {
  if (isLoading(props)) return <Skel tint={T.duskPurple} />;
  ITEMS = parse(props.output) || MOCK;
  const idx = getIdx(); const it = ITEMS[idx]; const total = ITEMS.length;
  return (
    <div id="ws-swap-root" aria-label={`Wallpaper ${idx + 1} of ${total}: ${it.name}`}>
      <DragHandle k="swap" />
      <ResizeHandle k="swap" />
      <span id="ws-swap-count" className="count">Frame {idx + 1} / {total}</span>
      <div className="glass">
        <div className="slide" title="Set as desktop picture" onClick={apply}>
          {it.data ? <img id="ws-swap-img" className="img" src={it.data} /> : <div className="bg" />}
          <span id="ws-swap-name" className="n">{it.name}</span>
        </div>
      </div>
      <span className="nav prev" title="Previous" onClick={step(-1)}>&#x2039;</span>
      <span className="nav next" title="Next" onClick={step(1)}>&#x203A;</span>
      <div className="film">
        <div id="ws-swap-strip" className="frames" style={{ transform: `translateX(${Math.max(-(total * 56 - 244), Math.min(0, 100 - idx * 56))}px)` }}>
          {ITEMS.map((x, i) => <div key={i} className={`frame ${i === idx ? "on" : ""}`} style={x.data ? { backgroundImage: `url(${x.data})` } : { background: COLORSAFE(i) }} title={x.name} onClick={pick(i)} />)}
        </div>
        <span className="edge">Safety film · {String(total).padStart(2, "0")} frames · wallpapers</span>
      </div>
    </div>
  );
};
const COLORSAFE = (i) => [T.duskBase, T.duskPurple, T.shaderPurple, T.shaderTeal][i % 4];
