import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    v8_viteEnvironmentApi: true,
  },
  //async prerender() {
  // return ["/", ...Object.values(utilities).map((it) => it.url)];
  //},
} satisfies Config;
