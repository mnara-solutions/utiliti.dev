import type { Config } from "@react-router/dev/config";
// import { utilities } from "./app/utilities";

export default {
  ssr: true,
  // async prerender() {
  //   return Object.values(utilities).map((it) => it.url);
  // },
} satisfies Config;
