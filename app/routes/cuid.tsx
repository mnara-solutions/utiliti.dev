import ContentWrapper from "~/components/content-wrapper";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useState, type ChangeEvent } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { init } from "@paralleldrive/cuid2";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { Routes } from "~/routes";
import NumberInput from "~/components/number-input";

export const meta = metaHelper(
  utilities.cuid.name,
  "Generate collision-resistant CUIDs optimized for horizontal scaling. Client-side generation means your IDs never touch our servers.",
  Routes.CUID,
);

export default function CuidGenerator() {
  const [number, setNumber] = useState(1);
  const [length, setLength] = useState(24);

  // cuid is already secure enough, but there could be an improvement by passing
  // in our own browser based CSPRNG. This functionality is not ready yet.
  // https://github.com/paralleldrive/cuid2/issues/18
  // const random = init({ random: crypto.getRandomValues });

  const onChangeLength = (e: ChangeEvent<HTMLInputElement>) => {
    setLength(Math.min(Math.max(parseInt(e.target.value, 10), 5), 50));
  };

  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
  };

  const random = init({ length });
  const output = Array.from(Array(number), () => random()).join("\n");

  return (
    <ContentWrapper>
      <h1>CUID Generator</h1>
      <p>
        Generate secure, collision-resistant IDs optimized for horizontal
        scaling and performance. All IDs are generated locally in your
        browser—nothing is sent to our servers.
      </p>

      <Box>
        <BoxTitle title="">
          <div className="flex items-center justify-start grow">
            <label
              htmlFor="length"
              className="block text-sm font-medium text-gray-900 dark:text-white pr-2"
            >
              Length:
            </label>
            <NumberInput
              id="length"
              type="number"
              min={5}
              max={50}
              value={length}
              onChange={onChangeLength}
            />
          </div>
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:px-4">
              <div className="sm:px text-center">
                <NumberInput
                  id="number"
                  type="number"
                  min={1}
                  max={500}
                  value={number}
                  onChange={onChangeNumber}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
              <Copy content={output} />
            </div>
          </div>
        </BoxTitle>

        <BoxContent isLast={true}>
          <ReadOnlyTextArea value={output} />
        </BoxContent>
      </Box>

      <h2>Why Use Utiliti&apos;s CUID Generator?</h2>
      <p>
        CUIDs are often used in production systems where ID predictability could
        be a security concern. Unlike many online ID generators that process
        requests server-side, Utiliti&apos;s CUID Generator runs{" "}
        <strong>entirely in your browser</strong>.
      </p>
      <p>Your generated IDs never leave your device, making it safe to:</p>
      <ul>
        <li>
          <strong>Test ID Formats</strong>: Experiment with CUID lengths without
          exposing your ID patterns
        </li>
        <li>
          <strong>Generate Production IDs</strong>: Create IDs for sensitive
          systems without third-party logging
        </li>
        <li>
          <strong>Batch Generation</strong>: Generate hundreds of IDs privately
          for testing or seeding databases
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Adjustable Length</strong>: Generate CUIDs from 5 to 50
          characters to fit your requirements
        </li>
        <li>
          <strong>Batch Generation</strong>: Create up to 500 CUIDs at once
        </li>
        <li>
          <strong>Instant Output</strong>: IDs are generated immediately with no
          server round-trip
        </li>
        <li>
          <strong>One-Click Copy</strong>: Easily copy all generated IDs to your
          clipboard
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Set the length</strong>: Adjust the length slider to your
          desired ID length (default is 24 characters)
        </li>
        <li>
          <strong>Set the quantity</strong>: Choose how many CUIDs you need
          (1-500)
        </li>
        <li>
          <strong>Copy the output</strong>: Click the copy button to grab your
          generated IDs
        </li>
      </ol>

      <h2>What is CUID?</h2>
      <p>
        CUID (Collision-resistant Unique Identifier) is a modern ID generation
        algorithm designed for distributed systems. CUID2 (the version used
        here) is the latest iteration, offering improved security and randomness
        over the original CUID.
      </p>
      <p>Key characteristics of CUID2:</p>
      <ul>
        <li>
          <strong>Collision Resistant</strong>: Designed to be unique across
          distributed systems without coordination
        </li>
        <li>
          <strong>Secure</strong>: Uses cryptographically secure random number
          generation
        </li>
        <li>
          <strong>Horizontal Scaling</strong>: Safe to generate across multiple
          servers simultaneously
        </li>
        <li>
          <strong>URL Safe</strong>: Contains only lowercase letters and numbers
        </li>
        <li>
          <strong>Non-Sequential</strong>: IDs don&apos;t reveal creation order,
          improving security
        </li>
      </ul>

      <h2>CUID vs UUID</h2>
      <p>
        While both CUID and UUID solve the unique identifier problem, they have
        different characteristics:
      </p>
      <ul>
        <li>
          <strong>Length</strong>: CUIDs are variable length (default 24 chars)
          vs UUIDs fixed 36 characters
        </li>
        <li>
          <strong>Characters</strong>: CUIDs use only lowercase alphanumeric vs
          UUIDs use hex with dashes
        </li>
        <li>
          <strong>Security</strong>: CUID2 is designed to be non-guessable;
          UUIDv4 is random but UUIDv1 leaks timestamp/MAC
        </li>
        <li>
          <strong>Size</strong>: CUIDs can be shorter, saving storage in
          high-volume systems
        </li>
      </ul>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Database Primary Keys</strong>: Ideal for distributed
          databases where auto-increment isn&apos;t practical
        </li>
        <li>
          <strong>API Resource IDs</strong>: URL-safe format works perfectly in
          REST endpoints
        </li>
        <li>
          <strong>Session Identifiers</strong>: Secure, non-guessable IDs for
          user sessions
        </li>
        <li>
          <strong>File Names</strong>: Generate unique, URL-safe file names for
          uploads
        </li>
        <li>
          <strong>Microservices</strong>: Generate IDs across services without
          central coordination
        </li>
      </ul>

      <h2>Learn More</h2>
      <p>
        CUID2 was created by Eric Elliott. For technical details and the full
        specification, visit the{" "}
        <a
          href="https://github.com/paralleldrive/cuid2"
          target="_blank"
          rel="noreferrer"
        >
          official CUID2 repository on GitHub
        </a>
        .
      </p>
    </ContentWrapper>
  );
}
