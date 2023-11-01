import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import dotenv from "dotenv";

dotenv.config();

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  build: {
    rollupOptions: {
      output: {
        globals: {
          VITE_ENDPOINT_URL: process.env.VITE_ENDPOINT_URL,
        },
      },
    },
  },
};
