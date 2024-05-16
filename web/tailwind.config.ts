import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Dynamic colors don't play well with JIT, so we need to whitelist them
  safelist: [
    'bg-blue-500',
    'bg-blue-700',
    'hover:bg-blue-700',
    'bg-emerald-500',
    'bg-emerald-700',
    'hover:bg-emerald-700',
    'bg-red-500',
    'bg-red-700',
    'hover:bg-red-700',
    'bg-gray-500',
    'bg-gray-700',
    'hover:bg-gray-700',
  ],
};
export default config;
