export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: "#F6F6F4",
        surface: "#FFFFFF",
        soft: "#F1F2EE",
        muted: "#E9ECE6",
        primary: {
          DEFAULT: "#1D1F1C",
          muted: "#8A9288",
        },
        secondary: "#5F665E",
        disabled: "#B3B9AF",
        'on-dark': "#FFFFFF",
        accent: {
          primary: {
            DEFAULT: "#2E8B57",
            hover: "#26764A",
            pressed: "#205F3C",
            soft: "#E3EFE8",
            border: "#6E9E81",
          },
          secondary: {
            DEFAULT: "#F7C3B0",
            hover: "#F2B29A",
            pressed: "#E79B7F",
            soft: "#FBE4DA",
          },
          tertiary: {
            DEFAULT: "#4F39F7",
            hover: "#402DE0",
            soft: "#ECE8FF",
          }
        },
        success: "#2E8B57",
        error: "#D96B4D",
        border: {
          light: "#E3E6DF",
          soft: "#D7DDD2",
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
