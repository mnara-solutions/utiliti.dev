import { useCallback, useMemo, useRef, useState } from "react";
import Utiliti from "~/components/utiliti";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import Box, { BoxContent, BoxOptions, BoxTitle } from "~/components/box";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/icon-button";

enum Action {
  GENERATE = "Generate",
}

export default function QrCode() {
  const [svg, setSvg] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const actions = useMemo(
    () => ({
      [Action.GENERATE]: async (input: string) => input,
    }),
    [],
  );

  const download = useCallback(() => {
    const node = componentRef.current?.children[0];

    if (!node) {
      return;
    }

    const uri = svg
      ? svgElementToUri(node as SVGElement)
      : (node as HTMLCanvasElement).toDataURL();
    const extension = svg ? "svg" : "png";

    const link = document.createElement("a");
    link.download = "qr-code." + extension;
    link.href = uri;
    link.click();
  }, [svg]);

  const renderOutput = useCallback(
    (_: string, input: string) => {
      const Component = svg ? QRCodeSVG : QRCodeCanvas;

      return (
        <Box>
          <BoxTitle title="Output">
            <IconButton
              icon={DocumentArrowDownIcon}
              label="Download"
              onClick={download}
            />
          </BoxTitle>
          <BoxContent
            isLast={true}
            className="max-h-full flex justify-center py-4"
          >
            <div ref={componentRef}>
              <Component value={input} size={256} />
            </div>
          </BoxContent>
        </Box>
      );
    },
    [download, svg],
  );

  return (
    <Utiliti
      label="QR Code"
      actions={actions}
      renderInput={(input, setInput) => (
        <textarea
          id="input"
          rows={3}
          className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
          placeholder="Paste in your URL…"
          required={true}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      )}
      renderOptions={() => (
        <BoxOptions isLast={false}>
          <div className="flex items-center h-5 w-5 ml-2">
            <input
              id="svg"
              type="checkbox"
              checked={svg}
              className="w-4 h-4 border rounded focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
              onChange={(e) => setSvg(e.target.checked)}
            />
          </div>
          <label
            htmlFor="url-safe"
            className="ml-2 text-sm font-medium text-gray-300"
          >
            SVG
          </label>
        </BoxOptions>
      )}
      renderOutput={renderOutput}
      showLoadFile={false}
    />
  );
}

function svgElementToUri(element: SVGElement) {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(element);

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
    );
  }

  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent('<?xml version="1.0" standalone="no"?>\r\n' + source)
  );
}
