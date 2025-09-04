import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    hmr: {
      overlay: false, // Disable HMR overlay
    },
    
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 3000,

    minify: "terser", // Use Terser for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console statements
        drop_debugger: true, // Remove debugger statements
      },
    },
  },
});
