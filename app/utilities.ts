import Routes from "~/routes";

/**
 * This file serves as an index of all available utilities and the content gets re-used in places like the sidebar
 * and the popular utilities component.
 */
export const utilities = {
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
};

export const sidebar = [
  {
    name: "Utilities",
    children: [utilities.privateNotes, utilities.json, utilities.dataurl],
  },
  {
    name: "Encoders & Decoders",
    children: [utilities.base64, utilities.url],
  },
];
