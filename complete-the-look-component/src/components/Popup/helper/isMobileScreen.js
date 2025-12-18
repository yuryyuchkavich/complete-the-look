export function isSM() {
  if (typeof window === "undefined") return false;
  return window?.matchMedia("(max-width: 768px)").matches;
}

export function isMDL() {
  if (typeof window === "undefined") return false;
  return window?.matchMedia("(max-width: 1024px)").matches;
}
