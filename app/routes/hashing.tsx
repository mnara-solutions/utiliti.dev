import { useState } from "react";
import Utiliti from "~/components/utiliti";
import { BoxOptions } from "~/components/box";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import SimpleOutput from "~/components/simple-output";
import Dropdown from "~/components/dropdown";
import ReadFile from "~/components/read-file";
import { setTextInputFromFiles } from "~/utils/convert-text-file";

export const meta = metaHelper(
  utilities.hashing.name,
  utilities.hashing.description,
);

enum Action {
  HASH = "Hash",
}

export default function QrCode() {
  const [algorithm, setAlgorithm] = useState("SHA-512");

  const actions = {
    [Action.HASH]: async (input: string) => {
      const msgUint8 = new TextEncoder().encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    },
  };

  const renderOutput = (a: string, input: string, output: string) => {
    return <SimpleOutput title={`Output - ${algorithm}`} output={output} />;
  };

  const renderOptions = () => (
    <BoxOptions isLast={false}>
      <Dropdown
        onOptionChange={setAlgorithm}
        options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((it) => ({
          id: it,
          label: it,
        }))}
        defaultValue={algorithm}
      />
    </BoxOptions>
  );

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

  const renderReadFile = (setInput: (value: string) => void) => {
    return (
      <ReadFile
        accept="text/plain,application/JSON"
        onLoad={(files) => setTextInputFromFiles(files, setInput)}
      />
    );
  };

  const renderExplanation = () => (
    <>
      <h2>What is a hash?</h2>
      <p>
        In the context of computer science and cryptography, a hash refers to
        the result of applying a hash function to a piece of data, such as a
        file or a message. A hash function takes input data and produces a
        fixed-size string of characters, which is typically a hexadecimal or
        binary representation.
      </p>

      <p>Key characteristics of hash functions include:</p>

      <ol>
        <li>
          <strong>Deterministic</strong>: The same input will always produce the
          same hash value.
        </li>

        <li>
          <strong>Fixed Size</strong>: The output (hash value) has a fixed size,
          regardless of the size of the input.
        </li>

        <li>
          <strong>Efficient</strong>: It should be computationally efficient to
          compute the hash value for any given input.
        </li>

        <li>
          <strong>Irreversibility</strong>: It should be computationally
          infeasible to reverse the process and obtain the original input from
          its hash value.
        </li>
      </ol>

      <p>
        Common hash functions include MD5 (Message Digest Algorithm 5), SHA-1
        (Secure Hash Algorithm 1), SHA-256, and SHA-3. MD5 and SHA-1 are older
        and considered insecure for cryptographic purposes due to
        vulnerabilities that have been discovered. SHA-256 and SHA-3 are
        currently considered more secure.
      </p>

      <p>
        Hash functions have various applications in computer science and
        security, including:
      </p>

      <ul>
        <li>
          <strong>Data Integrity</strong>: Hashes are used to verify the
          integrity of data. If the hash of the original data matches the hash
          of the received or stored data, it indicates that the data has not
          been altered.
        </li>

        <li>
          <strong>Digital Signatures</strong>: Hash functions are a crucial
          component of digital signatures. A digital signature is created by
          encrypting the hash value with a private key, and others can verify
          the signature using the corresponding public key.
        </li>

        <li>
          <strong>Password Storage</strong>: Hash functions are used to store
          passwords securely. Instead of storing the actual passwords, systems
          store the hash values. When a user attempts to log in, the system
          hashes the entered password and compares it to the stored hash.
        </li>

        <li>
          <strong>Cryptographic Applications</strong>: Hash functions play a
          role in various cryptographic protocols and algorithms.
        </li>
      </ul>
      <p>
        Hashing is a fundamental concept in computer science and is widely used
        in various applications to ensure data integrity, security, and
        efficiency.
      </p>
    </>
  );

  return (
    <Utiliti
      label={utilities.hashing.name}
      actions={actions}
      renderInput={renderInput}
      renderOptions={renderOptions}
      renderOutput={renderOutput}
      renderReadFile={renderReadFile}
      renderExplanation={renderExplanation}
    />
  );
}
