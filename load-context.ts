import { KVNamespace } from "@cloudflare/workers-types";
import { type AppLoadContext } from "@react-router/cloudflare";
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

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare };
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
  return {
    ...context,
  };
};
