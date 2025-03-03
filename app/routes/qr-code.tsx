import { useRef, useState } from "react";
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

  const actions = {
    [Action.GENERATE]: async (input: string) => input,
  };

  const download = () => {
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
  };

  const renderOutput = (_: string, input: string) => {
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
  };

  const renderOptions = () => (
    <BoxOptions isLast={false}>
      <div>
        <div className="flex flex-row pb-1">
          <div className="flex items-center h-5 w-5">
            <input
              id="svg"
              type="checkbox"
              checked={svg}
              className="w-4 h-4 border rounded-sm focus:ring-3 bg-zinc-700 border-zinc-600 text-orange-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800"
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
  );

  const renderInput = (input: string, setInput: (v: string) => void) => (
    <textarea
      id="input"
      rows={3}
      className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
      placeholder="Paste in your URL…"
      required={true}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    ></textarea>
  );

  const renderExplanation = () => (
    <>
      <h2>What is a QR Code?</h2>
      <p>
        A QR code, or Quick Response code, is a two-dimensional barcode that was
        initially created in 1994 by a Japanese company called Denso Wave. QR
        codes are designed to store information in a matrix format, allowing for
        a quick and efficient way to encode data. These codes can be scanned
        quickly using a camera-equipped device, such as a smartphone or a
        dedicated barcode scanner.
      </p>
      <p>
        The structure of a QR code consists of black squares arranged on a white
        square grid. QR codes can store a variety of data types, including
        numeric, alphanumeric, binary, and even Kanji characters. The amount of
        data a QR code can store depends on the size and version of the code. QR
        codes also include error correction capabilities, allowing them to be
        scanned even if part of the code is damaged or obscured.
      </p>

      <p>Common uses of QR codes include:</p>

      <ol>
        <li>
          <strong>URLs and Website Links</strong>: QR codes can encode website
          URLs, making it easy for users to access a website by scanning the
          code with their smartphones.
        </li>
        <li>
          <strong>Contact Information</strong>: QR codes can store contact
          information (vCard), enabling users to quickly add a new contact to
          their address book by scanning the code.
        </li>
        <li>
          <strong>Wi-Fi Network Configuration</strong>: QR codes can encode
          Wi-Fi network credentials, allowing users to connect to a Wi-Fi
          network by scanning the code.
        </li>
        <li>
          <strong>Geographic Coordinates</strong>: QR codes can encode
          geographic coordinates (latitude and longitude), useful for
          location-based services.
        </li>
        <li>
          <strong>Product Information</strong>: QR codes on products or
          advertisements can provide additional information, such as product
          details, promotions, or links to user manuals.
        </li>
        <li>
          <strong>Payment Transactions</strong>: QR codes are used in various
          mobile payment systems. Scanning a code can initiate a payment or
          transfer of funds.
        </li>
        <strong>Boarding Passes and Event Tickets</strong>: Airlines and event
        organizers often use QR codes on boarding passes and tickets for quick
        and easy check-in.
      </ol>

      <p>
        To read or scan a QR code, users typically use a smartphone or a
        dedicated QR code scanner app. Many modern smartphones come with
        built-in QR code scanning functionality in their camera apps.
      </p>

      <p>
        The widespread adoption of smartphones and the ease of use of QR codes
        have contributed to their popularity in various industries for tasks
        ranging from information sharing to facilitating quick and convenient
        transactions.
      </p>
    </>
  );

  return (
    <Utiliti
      label={utilities.qrCode.name}
      actions={actions}
      renderInput={renderInput}
      renderOptions={renderOptions}
      renderOutput={renderOutput}
      renderExplanation={renderExplanation}
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
          className="block bg-zinc-700 rounded-sm"
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
