import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    target: "es2022",
    // rollupOptions: {
    //   external: [
    //     "@yaireo/tagify/dist/react.tagify",
    //     "@yaireo/tagify/dist/tagify.css",
    //   ],
    // },
    chunkSizeWarningLimit: 3000,
  },
});
