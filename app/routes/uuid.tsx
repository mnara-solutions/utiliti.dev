import ContentWrapper from "~/components/content-wrapper";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import { useState, type ChangeEvent } from "react";
import Copy from "~/components/copy";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import { v1, v4, v6, v7 } from "uuid";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import NumberInput from "~/components/number-input";
import Dropdown from "~/components/dropdown";

export const meta = metaHelper(utilities.uuid);

export default function UuidGenerator() {
  const [number, setNumber] = useState(1);
  const [version, setVersion] = useState<number>(4);

  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
  };

  const onChangeVersion = (v: string) => {
    setVersion(parseInt(v, 10));
  };

  const output = Array.from(Array(number), () => {
    switch (version) {
      case 1:
        return v1();
      case 4:
        return v4();
      case 6:
        return v6();
      case 7:
        return v7();
      default:
        return v4();
    }
  }).join("\n");

  return (
    <ContentWrapper>
      <h1>UUID</h1>

      <p>
        Generate random Universally Unique IDentifiers (UUID) that match the{" "}
        <a
          href="https://www.ietf.org/rfc/rfc4122.txt"
          target="_blank"
          rel="noreferrer"
        >
          RFC4122
        </a>{" "}
        specification.
      </p>

      <Box>
        <BoxTitle title="">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:pr-4">
              <Dropdown
                defaultValue={4}
                options={[
                  { id: "1", label: "v1" },
                  { id: "4", label: "v4" },
                  { id: "6", label: "v6" },
                  { id: "7", label: "v7" },
                ]}
                onOptionChange={onChangeVersion}
              />
            </div>

            <div className="flex items-center space-x-1 sm:px-4">
              <div className="sm:px text-center">
                <NumberInput
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

      <h2>What is a UUID?</h2>
      <p>
        A UUID (Universally Unique Identifier) is a 128-bit identifier that is
        designed to be unique across all space and time. UUIDs are standardized
        by the{" "}
        <a
          href="https://www.ietf.org/rfc/rfc4122.txt"
          target="_blank"
          rel="noreferrer"
        >
          RFC 4122
        </a>{" "}
        specification and are commonly used in software development to identify
        resources without requiring a central authority to coordinate ID
        assignment.
      </p>
      <p>
        A typical UUID looks like this:{" "}
        <code>550e8400-e29b-41d4-a716-446655440000</code>. The format consists
        of 32 hexadecimal digits displayed in five groups separated by hyphens,
        in the form 8-4-4-4-12.
      </p>

      <h2>Why Generate UUIDs Client-Side?</h2>
      <p>
        Our UUID generator runs entirely in your browser using JavaScript&apos;s
        cryptographically secure random number generator. This means:
      </p>
      <ul>
        <li>
          <strong>Complete Privacy</strong>: Your generated UUIDs never leave
          your device—we don&apos;t see them, store them, or log them.
        </li>
        <li>
          <strong>No Network Required</strong>: Once the page loads, you can
          generate UUIDs even while offline.
        </li>
        <li>
          <strong>Instant Generation</strong>: No server round-trip means UUIDs
          are generated instantaneously.
        </li>
        <li>
          <strong>Cryptographically Secure</strong>: We use the Web Crypto API
          for random number generation, ensuring high-quality randomness.
        </li>
      </ul>

      <h2>UUID Versions Explained</h2>
      <p>
        Different UUID versions serve different purposes. Here&apos;s when to
        use each:
      </p>
      <ul>
        <li>
          <strong>UUID v1</strong>: Time-based UUID using timestamp and MAC
          address. Useful when you need sortable IDs and don&apos;t mind
          exposing generation time.
        </li>
        <li>
          <strong>UUID v4</strong>: Randomly generated UUID. The most commonly
          used version—perfect for general-purpose unique identifiers where
          privacy matters.
        </li>
        <li>
          <strong>UUID v6</strong>: Reordered time-based UUID. Like v1 but with
          improved database indexing performance due to better sorting
          characteristics.
        </li>
        <li>
          <strong>UUID v7</strong>: Unix timestamp-based UUID. The newest
          version, designed for modern distributed systems with excellent
          sortability and database performance.
        </li>
      </ul>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Database Primary Keys</strong>: UUIDs make excellent primary
          keys, especially in distributed databases where auto-incrementing IDs
          could conflict.
        </li>
        <li>
          <strong>API Resource Identifiers</strong>: Use UUIDs in REST APIs to
          identify resources without exposing internal database IDs.
        </li>
        <li>
          <strong>Session Tokens</strong>: Generate unique session identifiers
          for user authentication.
        </li>
        <li>
          <strong>File Names</strong>: Create unique file names for uploads to
          prevent naming collisions.
        </li>
        <li>
          <strong>Distributed Systems</strong>: Generate IDs across multiple
          servers without coordination or collision risk.
        </li>
      </ul>

      <h2>UUID vs GUID</h2>
      <p>
        You may see the term GUID (Globally Unique Identifier) used
        interchangeably with UUID. While Microsoft coined the term GUID, they
        are functionally identical to UUIDs. Both refer to 128-bit identifiers
        following the same format and generation algorithms.
      </p>
    </ContentWrapper>
  );
}
