import type { Config } from "@react-router/dev/config";
import { utilities } from "./app/utilities";

export default {
  ssr: true,
  prerender: ["/", ...Object.values(utilities).map((it) => it.url)],
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
