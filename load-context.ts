import { KVNamespace } from "@cloudflare/workers-types";
import { GetLoadContextFunction } from "@react-router/cloudflare";
import { type PlatformProxy } from "wrangler";

type Env = {
  PRIVATE_NOTES: KVNamespace;
  CF_WHOIS_KEY: string;
};
type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@react-router/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}

export const getLoadContext: GetLoadContextFunction = ({ context }) => {
  return {
    ...context,
  };
};
