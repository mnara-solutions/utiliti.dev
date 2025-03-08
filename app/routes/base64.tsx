import * as b64 from "base64-encoding";
import SimpleOutput from "~/components/simple-output";
import { useState } from "react";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { BoxOptions } from "~/components/box";
import Utiliti from "~/components/utiliti";
import ReadFile from "~/components/read-file";
import { setTextInputFromFiles } from "~/utils/convert-text-file";

export const meta = metaHelper(
  utilities.base64.name,
  utilities.base64.description,
);

enum Action {
  ENCODE = "Encode",
  DECODE = "Decode",
}

async function decode(text: string): Promise<string> {
  try {
    const decoder = await new b64.Base64Decoder().optimize();

    return new TextDecoder().decode(decoder.decode(text));
  } catch (e) {
    return Promise.reject({ message: (e as DOMException).message });
  }
}

export default function Base64() {
  const [urlSafe, setUrlSafe] = useState(false);

  const renderOutput = (a: string, input: string, output: string) => {
    return <SimpleOutput output={output} />;
  };

  const encode = async (text: string) => {
    try {
      const encoder = await new b64.Base64Encoder({
        url: urlSafe,
      }).optimize();

      return encoder.encode(new TextEncoder().encode(text));
    } catch (e) {
      return Promise.reject({ message: (e as DOMException).message });
    }
  };

  const actions = {
    [Action.ENCODE]: (input: string) => encode(input),
    [Action.DECODE]: (input: string) => decode(input),
  };

  const renderReadFile = (setInput: (value: string) => void) => {
    return (
      <ReadFile
        accept="text/plain,application/JSON"
        onLoad={(files) => setTextInputFromFiles(files, setInput)}
      />
    );
  };

  const renderInput = (input: string, setInput: (v: string) => void) => (
    <textarea
      id="input"
      rows={10}
      className="block font-mono w-full px-3 py-2 lg:text-sm border-0 bg-zinc-800 focus:ring-0 placeholder-zinc-400"
      placeholder="Paste in your content…"
      required={true}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    ></textarea>
  );

  const renderOptions = () => (
    <BoxOptions isLast={false}>
      <div className="flex items-center h-5 w-5 ml-2">
        <input
          id="url-safe"
          type="checkbox"
          checked={urlSafe}
          className="w-4 h-4 border rounded-sm focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
          onChange={(e) => setUrlSafe(e.target.checked)}
        />
      </div>
      <label
        htmlFor="url-safe"
        className="ml-2 text-sm font-medium text-gray-300"
      >
        URL Safe
      </label>
    </BoxOptions>
  );

  const renderExplanation = () => (
    <>
      <h2>What is Base64?</h2>

      <p>
        Base64 is a binary-to-text encoding scheme that is commonly used to
        encode binary data, such as images, audio files, or other binary
        content, into a text-based format. The encoding is called Base64 because
        it uses a set of 64 characters, consisting of A-Z, a-z, 0-9, and two
        additional characters, usually &apos;+&apos;, and &apos;/&apos;. The
        &apos;=&apos; character is often used as padding at the end of the
        encoded data to ensure that the length of the encoded text is a multiple
        of 4.
      </p>

      <p>
        The primary purpose of Base64 encoding is to represent binary data in a
        format that is safe for transport and storage in text-based systems,
        such as email or XML documents. It is commonly used in various
        applications, including:
      </p>

      <ol>
        <li>
          Email Attachments: Binary files (e.g., images or documents) are often
          Base64-encoded when included as attachments in email messages.
        </li>

        <li>
          Data URLs: In web development, Base64 encoding is sometimes used to
          embed small images or other resources directly into HTML or CSS files
          using data URLs.
        </li>

        <li>
          APIs and Web Services: Base64 encoding is used to encode binary data
          in JSON or XML payloads when exchanging information between systems.
        </li>

        <li>
          Data Storage: Base64 encoding can be used to store binary data in a
          text-based format, making it easier to work with in certain
          environments.
        </li>
      </ol>

      <p>
        The process of Base64 encoding involves breaking the binary data into
        chunks of 6 bits, which are then represented by a corresponding
        character in the Base64 character set. These chunks are combined to form
        the Base64-encoded string. Decoding is the reverse process, where
        Base64-encoded data is converted back to its original binary form.
      </p>

      <p>Here is a simple example:</p>

      <p>
        Original binary data: <code>01001001 00110010 00111000</code> (24 bits)
      </p>

      <p>
        Base64-encoded: <code>SSY=</code> (encoded using ASCII characters)
      </p>

      <p>
        It&apos;s important to note that while Base64 encoding is useful for
        representing binary data in a text-based format, it does not provide
        encryption or security. The purpose is primarily to ensure compatibility
        with text-based systems that may not handle binary data well.
      </p>
    </>
  );

  return (
    <Utiliti
      label="Base64"
      actions={actions}
      renderInput={renderInput}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
      renderOptions={renderOptions}
      renderExplanation={renderExplanation}
    />
  );
}
