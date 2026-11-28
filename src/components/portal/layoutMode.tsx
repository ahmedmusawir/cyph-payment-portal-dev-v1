"use client";

import { createContext, useContext } from "react";

/**
 * ABM007_FINAL layout modes (UI_SPEC 1):
 *  - "translated": signed-in pages (navy header, white cards on the ice page). The default.
 *  - "literal":    signed-out pages inside PublicShell (navy backdrop, centred white shell, gradient masthead).
 *  - "panel":      Add Pharmacy inside the signed-in navigation (translated page, masthead and cards in the content).
 */
export type LayoutModeValue = "translated" | "literal" | "panel";

const LayoutModeContext = createContext<LayoutModeValue>("translated");

export function LayoutMode({ mode, children }: { mode: LayoutModeValue; children: React.ReactNode }) {
  return <LayoutModeContext.Provider value={mode}>{children}</LayoutModeContext.Provider>;
}

export const useLayoutMode = () => useContext(LayoutModeContext);
