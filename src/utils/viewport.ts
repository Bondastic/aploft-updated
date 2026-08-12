// Viewport-hjælpere: undgå at mobil-browsere zoomer ind i tekstfelter,
// og sørg for at Linguas spotlight rammer det rigtige, når turen starter.

export const VIEWPORT_LOCKED =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

/** Finder (eller opretter) viewport-metaen og låser zoom. */
export function lockViewportZoom() {
  if (typeof document === "undefined") return;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", VIEWPORT_LOCKED);
}

/**
 * Tvinger siden tilbage til 1x zoom. Bruges når rundvisningen starter, så
 * spotlightet ikke rammer forkert efter en tidligere input-zoom (især Android).
 */
export function resetViewportZoom() {
  if (typeof window === "undefined") return;
  lockViewportZoom();
  try {
    window.scrollTo(0, 0);
    if (window.visualViewport && window.visualViewport.scale > 1.01) {
      // Et kort hop i meta-content tvinger Chrome/Safari til at lægge zoom ned.
      const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1.01, user-scalable=no, viewport-fit=cover"
        );
        window.setTimeout(() => {
          meta.setAttribute("content", VIEWPORT_LOCKED);
          window.scrollTo(0, 0);
        }, 30);
      }
    }
  } catch {
    // ignore
  }
}

export function viewportBox(): { width: number; height: number } {
  const vv = typeof window !== "undefined" ? window.visualViewport : null;
  return {
    width: vv?.width ?? window.innerWidth,
    height: vv?.height ?? window.innerHeight,
  };
}
