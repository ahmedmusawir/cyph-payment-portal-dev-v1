import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        heading: "hsl(var(--heading))",
        "ring-on-dark": "hsl(var(--ring-on-dark))",
        "shadow-tint": "hsl(var(--shadow-tint))",
        disabled: {
          DEFAULT: "hsl(var(--disabled))",
          foreground: "hsl(var(--disabled-foreground))",
        },
        brand: {
          navy: "hsl(var(--brand-navy))",
          "navy-deep": "hsl(var(--brand-navy-deep))",
          ice: "hsl(var(--brand-ice))",
          green: "hsl(var(--brand-green))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--pb-focus-ring, var(--ring)))", // surface-aware, see globals
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cyber Pharma semantic-four (Metro Warm, shared). Coral stays --primary (brand,
        // never a status). Pills use tinted bg + colored text, e.g. bg-success/15 text-success.
        navbar: {
          DEFAULT: "hsl(var(--navbar))",
          foreground: "hsl(var(--navbar-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      // ABM007_FINAL brand contract 3.6: explicit scale (one knob cannot give
      // 8px fields and 14px cards).
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        tile: "var(--radius-tile)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      // Brand contract 3.7: navy-tinted shadows.
      boxShadow: {
        shell: "0 18px 48px hsl(var(--shadow-tint) / 0.18), inset 0 1px 0 hsl(var(--card) / 0.6)",
        masthead: "0 12px 28px hsl(var(--shadow-tint) / 0.18)",
        card: "0 8px 20px hsl(var(--shadow-tint) / 0.05)",
        tile: "0 6px 16px hsl(var(--shadow-tint) / 0.25)",
        menu: "0 10px 24px hsl(var(--shadow-tint) / 0.14)",
      },
      fontFamily: {
        brand: ["var(--font-brand)", "system-ui", "sans-serif"],
        sans: ["var(--font-brand)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@shrutibalasa/tailwind-grid-auto-fit"),
    require("tailwindcss-animate"),
  ],
} satisfies Config;

export default config;
