import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '../types';

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function generate5RandomColors(): string[] {
  const baseHue = Math.floor(Math.random() * 360);
  const step = 65 + Math.floor(Math.random() * 15);
  return [0, 1, 2, 3, 4].map((i) => {
    const h = (baseHue + i * step) % 360;
    const s = 80 + Math.floor(Math.random() * 15); // 80-95% vibrant
    const l = 52 + Math.floor(Math.random() * 8);  // 52-60% optimal readability
    return hslToHex(h, s, l);
  });
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 99, g: 102, b: 241 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export const DEFAULT_5_COLORS = [
  '#6366f1', // Neon Indigo
  '#10b981', // Emerald Mint
  '#f59e0b', // Solar Amber
  '#ec4899', // Cyber Pink
  '#06b6d4', // Hyper Cyan
];

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  paletteColors: string[];
  randomizePalette: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
  accentColor: '#6366f1',
  setAccentColor: () => {},
  paletteColors: DEFAULT_5_COLORS,
  randomizePalette: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_accent_color');
      return saved && saved.startsWith('#') ? saved : '#6366f1';
    } catch {
      return '#6366f1';
    }
  });

  const [paletteColors, setPaletteColors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gameshelf_palette_colors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 5) return parsed;
      }
      return DEFAULT_5_COLORS;
    } catch {
      return DEFAULT_5_COLORS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_theme', theme);
    } catch (e) {
      console.error(e);
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.style.backgroundColor = '#0b0f19';
      document.body.style.color = '#f1f5f9';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_accent_color', accentColor);
    } catch (e) {
      console.error(e);
    }
    const { r, g, b } = hexToRgb(accentColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
  }, [accentColor]);

  useEffect(() => {
    try {
      localStorage.setItem('gameshelf_palette_colors', JSON.stringify(paletteColors));
    } catch (e) {
      console.error(e);
    }
  }, [paletteColors]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  const randomizePalette = () => {
    const newColors = generate5RandomColors();
    setPaletteColors(newColors);
    // Switch color to the first random color so the user immediately sees the color change
    setAccentColorState(newColors[0]);
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        toggleTheme,
        setTheme: setThemeState,
        accentColor,
        setAccentColor,
        paletteColors,
        randomizePalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
