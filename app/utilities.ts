import Routes from "~/routes";

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
    description: "Share private notes securely via a link.",
    url: Routes.PRIVATE_NOTES,
  },
  json: {
    name: "JSON",
    description: "View complex JSON documents as a tree structure.",
    url: Routes.JSON,
  },
  base64: {
    name: "Base64",
    description: "Easily encode and decode base64 content.",
    url: Routes.BASE64,
  },
  url: {
    name: "URL",
    description:
      "Encodes or decodes a string so that it conforms to the URL Specification.",
    url: Routes.URL,
  },
  dataurl: {
    name: "DataURL",
    description: "Displays a data url, with or without the data prefix.",
    url: Routes.DATAURL,
  },
  wordCounter: {
    name: "Word Counter",
    description:
      "Counts the number of characters, words and sentences in your text.",
    url: Routes.WORD_COUNTER,
  },
  markdownToHtml: {
    name: "Markdown to HTML",
    description: "Converts Markdown to HTML.",
    url: Routes.MARKDOWN_TO_HTML,
  },
  loremIpsum: {
    name: "Lorem Ipsum",
    description: "Generate Lorem Ipsum placeholder text.",
    url: Routes.LOREM_IPSUM,
  },
  uuid: {
    name: "UUID",
    description: "Generate random Universal Unique Identifiers.",
    url: Routes.UUID,
  },
  cuid: {
    name: "CUID",
    description:
      "Generate random collision resistant IDs optimized for horizontal scaling.",
    url: Routes.CUID,
  },
  nsLookup: {
    name: "NS Lookup",
    description: "Find DNS records for a domain name.",
    url: Routes.NS_LOOKUP,
  },
  whois: {
    name: "Whois",
    description:
      "Find information about where the domain was registered and by who.",
    url: Routes.WHOIS,
  },
  unixTimestamp: {
    name: "Unix Timestamp",
    description: "Easily convert to and from the unix timestamp.",
    url: Routes.UNIX_TIMESTAMP,
  },
  sqlFormatter: {
    name: "SQL Formatter",
    description: "Format your SQL queries before sharing them with others.",
    url: Routes.SQL_FORMATTER,
  },
  qrCode: {
    name: "QR Code",
    description: "Easily generate a QR code and download it.",
    url: Routes.QR_CODE,
  },
};

export const sidebar = [
  {
    name: "Utilities",
    children: [
      utilities.privateNotes,
      utilities.json,
      utilities.markdownToHtml,
      utilities.dataurl,
      utilities.wordCounter,
      utilities.url,
      utilities.base64,
      utilities.sqlFormatter,
      utilities.qrCode,
    ],
  },
  {
    name: "Random Generators",
    children: [utilities.loremIpsum, utilities.uuid, utilities.cuid],
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
