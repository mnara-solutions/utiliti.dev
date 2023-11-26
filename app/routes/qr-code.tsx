import { useCallback, useMemo, useRef, useState } from "react";
import Utiliti from "~/components/utiliti";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import Box, { BoxContent, BoxOptions, BoxTitle } from "~/components/box";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import IconButton from "~/components/icon-button";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";

export const meta = metaHelper(
  utilities.qrCode.name,
  utilities.qrCode.description,
);

enum Action {
  GENERATE = "Generate",
}

export default function QrCode() {
  const [svg, setSvg] = useState(false);
  const [background, setBackground] = useState("#ffffff");
  const [foreground, setForeground] = useState("#000000");
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
              <Component
                value={input}
                size={256}
                bgColor={background}
                fgColor={foreground}
              />
            </div>
          </BoxContent>
        </Box>
      );
    },
    [background, download, foreground, svg],
  );

  const renderOptions = useCallback(
    () => (
      <BoxOptions isLast={false}>
        <div>
          <div className="flex flex-row pb-1">
            <div className="flex items-center h-5 w-5">
              <input
                id="svg"
                type="checkbox"
                checked={svg}
                className="w-4 h-4 border rounded focus:ring-3 bg-zinc-700 border-zinc-600 text-orange-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800"
                onChange={(e) => setSvg(e.target.checked)}
              />
            </div>
            <label
              htmlFor="svg"
              className="ml-2 text-sm font-medium text-gray-300"
            >
              SVG
            </label>
          </div>

          <ColourPicker
            label="Background"
            value={background}
            setter={setBackground}
          />

          <ColourPicker
            label="Foreground"
            value={foreground}
            setter={setForeground}
          />
        </div>
      </BoxOptions>
    ),
    [background, foreground, svg],
  );

  const renderInput = useCallback(
    (input: string, setInput: (v: string) => void) => (
      <textarea
        id="input"
        rows={3}
        className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
        placeholder="Paste in your URL…"
        required={true}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
    ),
    [],
  );

  return (
    <Utiliti
      label={utilities.qrCode.name}
      actions={actions}
      renderInput={renderInput}
      renderOptions={renderOptions}
      renderOutput={renderOutput}
    />
  );
}

function ColourPicker({
  label,
  value,
  setter,
}: {
  readonly label: string;
  readonly value: string;
  readonly setter: (v: string) => void;
}) {
  return (
    <div className="flex flex-row pb-1">
      <div className="flex items-center h-5 w-5">
        <input
          type="color"
          className="block bg-zinc-700 rounded"
          style={{
            width: "1.05rem",
            height: "1.05rem",
          }}
          id={label}
          defaultValue={value}
          onChange={(e) => setter(e.target.value)}
          title="Choose your color"
        />
      </div>
      <label htmlFor={label} className="ml-2 text-sm font-medium text-gray-300">
        {label}
      </label>
    </div>
  );
}

function svgElementToUri(element: SVGElement) {
  const serializer = new XMLSerializer();

  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      '<?xml version="1.0" standalone="no"?>\r\n' +
        serializer.serializeToString(element),
    )
  );
}
