import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import babel from "vite-plugin-babel";

/**
 * Mock globalThis.Cloudflare for pre-rendering in Node.js.
 * The Cloudflare vite plugin generates code that accesses Cloudflare-specific
 * APIs which don't exist in Node.js where pre-rendering runs.
 */
function mockCloudflareForPrerender(): Plugin {
  return {
    name: "mock-cloudflare-for-prerender",
    renderChunk(code, chunk) {
      if (chunk.fileName.includes("worker-entry")) {
        const mock = `
if (typeof globalThis.Cloudflare === "undefined") {
  globalThis.Cloudflare = {
    compatibilityFlags: {
      enable_nodejs_process_v2: false,
    },
  };
}
`;
        return mock + code;
      }
      return null;
    },
  };
}

export default defineConfig(() => ({
  server: {
    port: 8788,
    fs: {
      // Restrict files that could be served by Vite's dev server.  Accessing
      // files outside this directory list that aren't imported from an allowed
      // file will result in a 403.  Both directories and files can be provided.
      // If you're comfortable with Vite's dev server making any file within the
      // project root available, you can remove this option.  See more:
      // https://vitejs.dev/config/server-options.html#server-fs-allow
      allow: ["app", "node_modules/highlight.js"],
    },
  },
  plugins: [
    mockCloudflareForPrerender(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
  ],
}));
