export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = (hex || "#2563eb").replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getContrastTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 165 ? "#0f172a" : "#ffffff";
}

export function getTeamStyleVariables(primaryColor: string, secondaryColor?: string): React.CSSProperties {
  const primary = primaryColor || "#2563eb";
  const secondary = secondaryColor && secondaryColor !== "#ffffff" && secondaryColor !== "#000000"
    ? secondaryColor
    : "#64748b";

  const pRgb = hexToRgb(primary);
  const sRgb = hexToRgb(secondary);
  const contrast = getContrastTextColor(primary);

  return {
    "--team-primary": primary,
    "--team-primary-rgb": `${pRgb.r}, ${pRgb.g}, ${pRgb.b}`,
    "--team-secondary": secondary,
    "--team-secondary-rgb": `${sRgb.r}, ${sRgb.g}, ${sRgb.b}`,
    "--team-contrast": contrast,
  } as React.CSSProperties;
}
