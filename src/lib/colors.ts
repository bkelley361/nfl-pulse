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

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let { r, g, b } = hexToRgb(hex);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Ensures high-contrast readability in Dark Mode for dark team colors (like Bears, Cowboys, Ravens, Eagles)
export function getReadableDarkColor(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  // If the color is too dark to read on dark backgrounds, lift lightness to 65% with healthy saturation
  if (l < 55) {
    return hslToHex(h, Math.max(s, 75), 65);
  }
  return hex;
}

export function getContrastTextColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 165 ? "#0f172a" : "#ffffff";
}

export function getTeamStyleVariables(
  primaryColor: string,
  secondaryColor?: string
): React.CSSProperties {
  const primary = primaryColor || "#2563eb";
  const secondary =
    secondaryColor && secondaryColor !== "#ffffff" && secondaryColor !== "#000000"
      ? secondaryColor
      : "#64748b";

  const pRgb = hexToRgb(primary);
  const sRgb = hexToRgb(secondary);
  const contrast = getContrastTextColor(primary);
  const primaryReadable = getReadableDarkColor(primary);
  const readableRgb = hexToRgb(primaryReadable);

  return {
    "--team-primary": primary,
    "--team-primary-rgb": `${pRgb.r}, ${pRgb.g}, ${pRgb.b}`,
    "--team-primary-readable": primaryReadable,
    "--team-primary-readable-rgb": `${readableRgb.r}, ${readableRgb.g}, ${readableRgb.b}`,
    "--team-secondary": secondary,
    "--team-secondary-rgb": `${sRgb.r}, ${sRgb.g}, ${sRgb.b}`,
    "--team-contrast": contrast,
  } as React.CSSProperties;
}
