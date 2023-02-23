import type { MetaFunction } from "@remix-run/cloudflare";
import EncoderDecoder from "~/components/encoder-decoder";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";

export const meta: MetaFunction = () =>
  metaHelper(utilities.url.name, utilities.url.description);

async function encode(text: string): Promise<string> {
  return encodeURI(text);
}

async function decode(text: string): Promise<string> {
  return decodeURI(text);
}

export default function JSONEncoder() {
  return (
    <EncoderDecoder
      label="URL"
      encode={encode}
      decode={decode}
      showLoadFile={false}
      rows={3}
    />
  );
}
