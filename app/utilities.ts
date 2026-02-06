import { Routes } from "./routes";

/**
 * Represents a utility tool available on the site.
 */
export type Utility = {
  readonly name: string;
  readonly description: string;
  readonly url: string;
};

/**
 * This file serves as an index of all available utilities and the content gets re-used in places like the sidebar
 * and the popular utilities component.
 */
export const utilities: Record<string, Utility> = {
  privateNotes: {
    name: "Private Notes",
    description:
      "Create self-destructing encrypted notes. Share passwords, API keys, and secrets securely. Zero-knowledge architecture.",
    url: Routes.PRIVATE_NOTES,
  },
  json: {
    name: "JSON",
    description:
      "View, format, and minify JSON instantly. Client-side processing means your data never leaves your browser—safe for API responses, configs, and sensitive data.",
    url: Routes.JSON,
  },
  prettier: {
    name: "Prettier",
    description:
      "Format HTML, TypeScript, and CSS code instantly. Client-side processing keeps your code private and never leaves your browser.",
    url: Routes.PRETTIER,
  },
  base64: {
    name: "Base64",
    description:
      "Encode and decode Base64 instantly. Safe for tokens, credentials, and sensitive data—your input never leaves your browser.",
    url: Routes.BASE64,
  },
  url: {
    name: "URL",
    description:
      "Encode, decode, and parse URLs instantly. Client-side processing means your URLs with sensitive parameters never leave your browser.",
    url: Routes.URL,
  },
  dataurl: {
    name: "Data URL",
    description:
      "Display and decode data URLs privately. Convert images to Base64 data URLs entirely in your browser—your files never leave your device.",
    url: Routes.DATAURL,
  },
  imageConverter: {
    name: "Image Converter",
    description:
      "Convert images between JPG, PNG, and WebP formats privately. All processing happens in your browser—your images never leave your device.",
    url: Routes.IMAGE_CONVERTER,
  },
  wordCounter: {
    name: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs instantly. Get reading time estimates and word frequency analysis—all privately in your browser.",
    url: Routes.WORD_COUNTER,
  },
  markdownToHtml: {
    name: "Markdown to HTML",
    description:
      "Convert Markdown to HTML instantly. Client-side processing means your documentation and notes never leave your browser.",
    url: Routes.MARKDOWN_TO_HTML,
  },
  loremIpsum: {
    name: "Lorem Ipsum",
    description:
      "Generate Lorem Ipsum placeholder text instantly. Customizable paragraphs, sentences, and words.",
    url: Routes.LOREM_IPSUM,
  },
  password: {
    name: "Password Generator",
    description:
      "Generate cryptographically secure passwords instantly. Created locally using Web Crypto API—your passwords never leave your browser.",
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
      "Generate collision-resistant CUIDs optimized for horizontal scaling. Client-side generation means your IDs never touch our servers.",
    url: Routes.CUID,
  },
  nsLookup: {
    name: "NS Lookup",
    description:
      "Look up DNS records for any domain. Query A, AAAA, MX, TXT, NS, CNAME, and more record types.",
    url: Routes.NS_LOOKUP,
  },
  whois: {
    name: "Whois",
    description:
      "Look up domain registration information. Find registrar, owner details, registration dates, and nameservers.",
    url: Routes.WHOIS,
  },
  unixTimestamp: {
    name: "Unix Timestamp",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, microseconds, and nanoseconds.",
    url: Routes.UNIX_TIMESTAMP,
  },
  timezoneConverter: {
    name: "Timezone Converter",
    description:
      "Convert dates and times between timezones instantly. Supports all IANA timezones with accurate daylight saving adjustments.",
    url: Routes.TIMEZONE_CONVERTER,
  },
  sqlFormatter: {
    name: "SQL Formatter",
    description:
      "Format and beautify SQL queries instantly. Supports multiple dialects. Your queries never leave your browser—safe for sensitive schemas.",
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
      "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes instantly. Client-side processing means your sensitive data never leaves your browser.",
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
    children: [utilities.unixTimestamp, utilities.timezoneConverter],
  },
];
