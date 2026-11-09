/* Modern Snake — publisher-provided Adsterra GET CODE for its own domain.
 * Initial menu only; keep original snippets byte-for-byte inside strings.
 * Exactly one original tag per page load, only with first-party consent.
 * No requests on previews / other domains / offline; no auto refresh.
 * Parser-time document.write follows existing approved Apps & Games pilots.
 */
(() => {
  "use strict";
  if (location.hostname !== "snake.appsandgames.org") return;
  if (document.readyState !== "loading") return;
  if (navigator.onLine === false) return;
  const current = document.currentScript;
  const slot = current?.parentElement;
  const area = slot?.parentElement;
  if (!slot?.classList.contains("snake-ad-unit") ||
      area?.id !== "snake-ad-area") return;
  if (document.getElementById("menuScreen")?.classList.contains("active") !== true) return;
  if (!matchMedia("(min-width: 320px)").matches) return;
  const desktop = matchMedia("(min-width: 800px)").matches;
  const unit = current.dataset.unit;
  if ((desktop && unit !== "desktop") || (!desktop && unit !== "mobile")) return;

  let allowed = false;
  try {
    const entry = document.cookie.split(";").map(s => s.trim())
      .find(s => s.startsWith("ag_privacy_choices_v1="));
    const data = entry && JSON.parse(decodeURIComponent(
      entry.slice("ag_privacy_choices_v1=".length)));
    const age = data && Date.now() - data.timestamp;
    allowed = !!data && data.version === 1 &&
      data.partnerRevision === "adsterra-2026-11" &&
      data.advertising === true &&
      Number.isFinite(age) && age >= 0 &&
      age <= 180 * 24 * 60 * 60 * 1000;
  } catch (_) { allowed = false; }
  if (!allowed) return;
  const snippets = {
    desktop: "<script>\n  atOptions = {\n    'key' : 'e2fb1b71b1f1c06ed49949aea280fd25',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src=\"https://bauval.org/22/e2fb1b71b1f1c06ed49949aea280fd25\"></script>",
    mobile: "<script>\n  atOptions = {\n    'key' : 'c66b218e34b8a570c5e854dce85a30c3',\n    'format' : 'iframe',\n    'height' : 50,\n    'width' : 320,\n    'params' : {}\n  };\n</script>\n<script src=\"https://bauval.org/22/c66b218e34b8a570c5e854dce85a30c3\"></script>"
  };
  area.hidden = false;
  slot.hidden = false;
  const label = document.createElement("span");
  label.className = "snake-ad-label";
  label.textContent = "Advertisement";
  slot.insertBefore(label, current);
  document.write(snippets[unit]);
})();
