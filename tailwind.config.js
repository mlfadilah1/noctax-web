/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna background utama yang pekat dan elegan
        abyss: {
          DEFAULT: '#0A0F1F',
          light: '#141B2D', // Sedikit lebih terang untuk card/modal
          dark: '#050811',  // Lebih gelap untuk footer/sidebar
        },
        // Warna aksen untuk tombol, link, dan efek glow
        techblue: {
          DEFAULT: '#2496ED',
          hover: '#1B75BE', // Saat tombol di-hover
          glow: 'rgba(36, 150, 237, 0.3)', // Untuk shadow glow
        }
      },
      fontFamily: {
        // Rekomendasi font modern untuk IT/Tech
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'], 
      }
    },
  },
  plugins: [],
}