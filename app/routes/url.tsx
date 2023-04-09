import EncoderDecoder from "~/components/encoder-decoder";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { URLJsonFormatData } from "~/types/url";

export const meta = metaHelper(utilities.url.name, utilities.url.description);

function encode(text: string): string {
  return encodeURI(text);
}

function decode(text: string): string {
  return decodeURI(text);
}

function toJson(text: string) {
  const url = new URL(text);

  const data: URLJsonFormatData = {
    hash: url.hash,
    host: url.host,
    hostname: url.hostname,
    href: url.href,
    origin: url.origin,
    password: url.password,
    pathname: url.pathname,
    port: url.port,
    protocol: url.protocol,
    search: url.search,
    searchParams: Object.fromEntries(url.searchParams),
    username: url.username,
  };

  return data;
}

export default function JSONEncoder() {
  return (
    <EncoderDecoder
      label="URL"
      encode={encode}
      decode={decode}
      toJson={toJson}
      showLoadFile={false}
      rows={3}
    />
  );
}
