import type { Config } from "@react-router/dev/config";
// import { utilities } from "./app/utilities";

export default {
  ssr: true,
<<<<<<< Updated upstream
  // async prerender() {
  //   return Object.values(utilities).map((it) => it.url);
  // },
=======
  prerender: [],
  // To enable prerendering, uncomment and adjust:
  // prerender: ["/", ...Object.values(utilities).map((it) => it.url)],
>>>>>>> Stashed changes
} satisfies Config;
