import { Routes } from "./routes";

/**
 * This file serves as an index of all available utilities and the content gets re-used in places like the sidebar
 * and the popular utilities component.
 */
export const utilities: Record<
  string,
  { readonly name: string; readonly description: string; readonly url: string }
> = {
  privateNotes: {
    name: "Private Notes",
    description:
      "Share secrets securely with self-destructing, encrypted notes. Zero-knowledge architecture.",
    url: Routes.PRIVATE_NOTES,
  },
  json: {
    name: "JSON",
    description:
      "View, format, and minify JSON privately. Your data never leaves your browser.",
    url: Routes.JSON,
  },
  prettier: {
    name: "Prettier",
    description:
      "Format HTML, TypeScript, and CSS code instantly. Client-side processing keeps your code private.",
    url: Routes.PRETTIER,
  },
  base64: {
    name: "Base64",
    description:
      "Encode and decode Base64 securely. Safe for tokens, credentials, and sensitive data.",
    url: Routes.BASE64,
  },
  url: {
    name: "URL",
    description:
      "Encode and decode URLs instantly. Client-side processing for complete privacy.",
    url: Routes.URL,
  },
  dataurl: {
    name: "Data URL",
    description:
      "Display and decode data URLs privately. Your files never leave your browser.",
    url: Routes.DATAURL,
  },
  imageConverter: {
    name: "Image Converter",
    description:
      "Convert images between formats locally. No uploads—your images stay on your device.",
    url: Routes.IMAGE_CONVERTER,
  },
  wordCounter: {
    name: "Word Counter",
    description:
      "Count characters, words, and sentences instantly. Your text stays private.",
    url: Routes.WORD_COUNTER,
  },
  markdownToHtml: {
    name: "Markdown to HTML",
    description:
      "Convert Markdown to HTML in your browser. No server processing required.",
    url: Routes.MARKDOWN_TO_HTML,
  },
  loremIpsum: {
    name: "Lorem Ipsum",
    description:
      "Generate placeholder text instantly. Customizable paragraphs, sentences, and words.",
    url: Routes.LOREM_IPSUM,
  },
  password: {
    name: "Password Generator",
    description:
      "Generate cryptographically secure passwords. Created locally using Web Crypto API.",
    url: Routes.PASSWORD_GENERATOR,
  },
  uuid: {
    name: "UUID Generator",
    description:
      "Generate UUIDs (v1, v4, v6, v7) instantly. RFC 4122 compliant, client-side generation.",
    url: Routes.UUID,
  },
  cuid: {
    name: "CUID Generator",
    description:
      "Generate collision-resistant IDs for distributed systems. Created locally in your browser.",
    url: Routes.CUID,
  },
  nsLookup: {
    name: "NS Lookup",
    description:
      "Find DNS records for any domain. Query A, AAAA, MX, TXT, and more record types.",
    url: Routes.NS_LOOKUP,
  },
  whois: {
    name: "Whois",
    description:
      "Look up domain registration information. Find registrar, dates, and nameservers.",
    url: Routes.WHOIS,
  },
  unixTimestamp: {
    name: "Unix Timestamp",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. All processing is local.",
    url: Routes.UNIX_TIMESTAMP,
  },
  sqlFormatter: {
    name: "SQL Formatter",
    description:
      "Format SQL queries privately. Your queries never leave your browser—safe for sensitive schemas.",
    url: Routes.SQL_FORMATTER,
  },
  qrCode: {
    name: "QR Code Generator",
    description:
      "Generate QR codes instantly in your browser. No data sent to servers.",
    url: Routes.QR_CODE,
  },
  hashing: {
    name: "Hash Generator",
    description:
      "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes locally. Your data stays private.",
    url: Routes.HASHING,
  },
};

export const sidebar = [
  {
    name: "Utilities",
    children: [
      utilities.privateNotes,
      utilities.json,
      utilities.prettier,
      utilities.markdownToHtml,
      utilities.dataurl,
      utilities.imageConverter,
      utilities.wordCounter,
      utilities.url,
      utilities.base64,
      utilities.sqlFormatter,
      utilities.qrCode,
      utilities.hashing,
    ],
  },
  {
    name: "Random Generators",
    children: [
      utilities.loremIpsum,
      utilities.password,
      utilities.uuid,
      utilities.cuid,
    ],
  },
  {
    name: "DNS",
    children: [utilities.nsLookup, utilities.whois],
  },
  {
    name: "Time",
    children: [utilities.unixTimestamp],
  },
];
