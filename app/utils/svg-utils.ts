export function cleanSvg(svgString: string) {
  // Parse the SVG string into a DOM document
  const parser = new DOMParser();

  const svgDoc = parser.parseFromString(
    removeComments(svgString),
    "image/svg+xml",
  );
  const svgRoot = svgDoc.documentElement;

  removeNamespaces(svgRoot, svgString);
  removeWhitespace(svgRoot);

  // Serialize the cleaned SVG back to a string
  const serializer = new XMLSerializer();

  return serializer.serializeToString(svgDoc);
}

function removeComments(svgString: string): string {
  return svgString.replace(/<!--.*?-->/g, "");
}

export function encodeSvg(svgString: string) {
  return svgString
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " ");
}

function removeNamespaces(svgRoot: HTMLElement, svgString: string): void {
  // Find all namespaces used in the SVG
  const namespaces: Set<string> = new Set();

  Array.from(svgRoot.attributes).forEach((attr) => {
    if (attr.name.startsWith("xmlns:")) {
      namespaces.add(attr.name.split(":")[1]);
    }
  });
  // Remove namespaces that are not used
  for (const namespace of namespaces) {
    if (!svgString.match(new RegExp(`{namespace}:\\w+=".*?"`, "g"))?.length) {
      svgRoot.removeAttribute(`xmlns:${namespace}`);
    }
  }
}

// Remove whitespace and normalize attributes
function removeWhitespace(node: HTMLElement): void {
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const child = node.childNodes[i];
    if (
      child.nodeType === 3 &&
      child.textContent &&
      child.textContent.trim() === ""
    ) {
      // Remove empty text nodes
      node.removeChild(child);
    } else if (child.nodeType === 1) {
      // Recursively remove whitespace from child elements
      removeWhitespace(child as HTMLElement);
    }
  }
  // Normalize attributes by removing any unused ones
  for (let i = node.attributes.length - 1; i >= 0; i--) {
    const attr = node.attributes[i];
    if (!attr.specified) {
      // Remove unused attributes
      node.removeAttributeNode(attr);
    }
  }
}
