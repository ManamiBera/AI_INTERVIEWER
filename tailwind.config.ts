import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        hover: "var(--bg-hover)",
        border: {
          subtle: "var(--border-subtle)",
          glow: "var(--border-glow)",
        },
        accent: {
          DEFAULT: "var(--accent-cyan)",
          dim: "var(--accent-cyan-dim)",
          soft: "var(--accent-cyan-soft)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        score: {
          green: "var(--score-green)",
          amber: "var(--score-amber)",
          red: "var(--score-red)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(34, 211, 238, 0.28)",
        "glow-sm": "0 0 12px rgba(34, 211, 238, 0.18)",
        card: "0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,211,238,0.08), transparent 70%)",
        "cyan-gradient":
          "linear-gradient(135deg, rgba(34,211,238,0.9) 0%, rgba(14,165,196,0.9) 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.24s ease-out",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

//edit