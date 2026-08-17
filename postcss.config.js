const path = require("path");

// Absolute config path: Tailwind's own config search walks upward from
// process.cwd(), which can differ from this project directory depending on
// how the dev server process was launched — pointing at it explicitly
// avoids relying on that search.
module.exports = {
  plugins: {
    tailwindcss: { config: path.join(__dirname, "tailwind.config.ts") },
    autoprefixer: {},
  },
};
