// Custom environment bindings for this Worker
// Note: Cloudflare Workers runtime types are provided by @cloudflare/workers-types

interface Env {
  PRIVATE_NOTES: KVNamespace;
  CF_WHOIS_KEY: string;
}
