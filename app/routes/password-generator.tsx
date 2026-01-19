import { type ChangeEvent, useLayoutEffect, useReducer, useState } from "react";
import Box, { BoxButtons, BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Slider from "~/components/slider";
import Checkbox from "~/components/checkbox";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import Copy from "~/components/copy";
import Button from "~/components/button";
import NumberInput from "~/components/number-input";

export const meta = metaHelper(
  utilities.password.name,
  "Generate cryptographically secure passwords instantly. Client-side generation using Web Crypto API means your passwords never leave your browser.",
);

// Currently not necessary, but if you want to add more potential for password (utf-8 > 255) characters, you can use this function
function getCryptoGraphicallyRandomIntLargerMax(max: number) {
  const randomBuffer = new Uint32Array(1);

  window.crypto.getRandomValues(randomBuffer);

  let randomNumber = randomBuffer[0] / (0xffffffff + 1);

  randomNumber *= max;

  return Math.floor(randomNumber);
}

function getCryptoGraphicallyRandomInt(max: number) {
  if (max > 255) {
    return getCryptoGraphicallyRandomIntLargerMax(max);
  }

  const array = new Uint8Array(1);

  do {
    window.crypto.getRandomValues(array);
  } while (array[0] > max);

  return (array[0] % max) + 1;
}

function generatePassword(
  characters: number,
  useUpperCase: boolean,
  useLowerCase: boolean,
  useDigits: boolean,
  useSpecial: boolean,
) {
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let charactersToUse = "";

  if (useUpperCase) {
    charactersToUse += upperCase;
  }

  if (useLowerCase) {
    charactersToUse += lowerCase;
  }

  if (useDigits) {
    charactersToUse += digits;
  }

  if (useSpecial) {
    charactersToUse += special;
  }

  let password = "";

  for (let i = 0; i < characters; i++) {
    password += charactersToUse.charAt(
      getCryptoGraphicallyRandomInt(charactersToUse.length),
    );
  }

  return password;
}

export default function PasswordGenerator() {
  const [number, setNumber] = useState(1);
  const [characters, setCharacters] = useState(20);
  const [useUpperCase, setUseUpperCase] = useState(true);
  const [useLowerCase, setLowerUpperCase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");

  // hack: we don't have a way to re-render inside a function component without something changing
  const [forceUpdate, setForceUpdate] = useReducer((x) => x + 1, 0);

  const onChangeNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setNumber(Math.min(Math.max(parseInt(e.target.value, 10), 1), 500));
  };

  // we need to use a layout effect here because `generatePassword` calls upon `window.crypto`, which is not available
  // when rendering on the server side (node).
  useLayoutEffect(() => {
    setGeneratedPassword(
      Array.from(Array(number), () =>
        generatePassword(
          characters,
          useUpperCase,
          useLowerCase,
          useDigits,
          useSpecial,
        ),
      ).join("\n"),
    );
  }, [
    characters,
    useDigits,
    useLowerCase,
    useSpecial,
    useUpperCase,
    number,
    forceUpdate,
  ]);

  return (
    <ContentWrapper>
      <h1>{utilities.password.name}</h1>

      <Box>
        <BoxTitle title="Settings" />

        <BoxContent isLast={false} className="px-3 py-2 flex flex-col gap-y-2">
          <Slider
            id="characters"
            label={`Characters (${characters})`}
            value={characters}
            min={10}
            max={255}
            onChange={setCharacters}
          />

          <Checkbox
            id="use-upper-case"
            label={`Use upper case in password`}
            value={useUpperCase}
            onChange={(e) => setUseUpperCase(e.target.checked)}
          />

          <Checkbox
            id="use-lower-case"
            label={`Use lower case in password`}
            value={useLowerCase}
            onChange={(e) => setLowerUpperCase(e.target.checked)}
          />

          <Checkbox
            id="use-digits"
            label={`Use digits in password`}
            value={useDigits}
            onChange={(e) => setUseDigits(e.target.checked)}
          />

          <Checkbox
            id="use-special"
            label={`Use special characters in password`}
            value={useSpecial}
            onChange={(e) => setUseSpecial(e.target.checked)}
          />
        </BoxContent>

        <BoxButtons>
          <div className="flex w-full justify-end gap-x-2">
            <Button onClick={setForceUpdate} label="Generate" />
          </div>
        </BoxButtons>
      </Box>

      <Box className="mt-6">
        <BoxTitle title="Output">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:px-4">
              <div className="sm:px text-center">
                <NumberInput
                  id="length"
                  type="number"
                  min={1}
                  max={500}
                  value={number}
                  onChange={onChangeNumber}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
              <Copy content={generatedPassword} />
            </div>
          </div>
        </BoxTitle>
        <BoxContent isLast={true}>
          <ReadOnlyTextArea value={generatedPassword} />
        </BoxContent>
      </Box>

      <h2>What Makes a Password Secure?</h2>
      <p>
        A secure password is one that is difficult for both humans and computers
        to guess. The strength of a password depends on three main factors:
        length, complexity, and randomness. Our password generator maximizes all
        three to create passwords that would take centuries to crack with
        current technology.
      </p>
      <p>
        The most common password attacks involve trying dictionary words, common
        substitutions (like &quot;p@ssw0rd&quot;), and patterns. Truly random
        passwords—like the ones generated here—are immune to these attacks
        because there&apos;s no pattern to exploit.
      </p>

      <h2>Why Generate Passwords Client-Side?</h2>
      <p>
        Many password generators send requests to their servers to generate
        passwords. This is a critical security flaw—your new password could be
        logged, intercepted, or stored by the service provider.
      </p>
      <p>
        Utiliti&apos;s Password Generator runs entirely in your browser using
        the Web Crypto API, which provides cryptographically secure random
        number generation. Your passwords are:
      </p>
      <ul>
        <li>
          <strong>Never transmitted</strong>: Generated locally, your passwords
          never touch our servers
        </li>
        <li>
          <strong>Truly random</strong>: We use{" "}
          <code>crypto.getRandomValues()</code>, the gold standard for secure
          randomness in browsers
        </li>
        <li>
          <strong>Instantly available</strong>: No network requests means
          instant generation, even offline
        </li>
      </ul>

      <h2>How to Use This Generator</h2>
      <ol>
        <li>
          <strong>Set the length</strong>: Use the slider to choose between
          10-255 characters. Longer is generally better—we recommend at least 16
          characters for important accounts.
        </li>
        <li>
          <strong>Choose character types</strong>: Select which character sets
          to include. More variety means stronger passwords.
        </li>
        <li>
          <strong>Generate multiple</strong>: Need passwords for several
          accounts? Set the quantity and generate them all at once.
        </li>
        <li>
          <strong>Copy and use</strong>: Click the copy button to grab your
          password(s) and store them in your password manager.
        </li>
      </ol>

      <h2>Password Strength Recommendations</h2>
      <p>
        Different accounts warrant different password strengths. Here are our
        recommendations:
      </p>
      <ul>
        <li>
          <strong>Critical accounts (banking, email)</strong>: 20+ characters
          with all character types enabled
        </li>
        <li>
          <strong>Important accounts (social media, shopping)</strong>: 16+
          characters with uppercase, lowercase, and numbers
        </li>
        <li>
          <strong>Low-risk accounts</strong>: 12+ characters minimum
        </li>
        <li>
          <strong>Wi-Fi passwords</strong>: 20+ characters (you only enter it
          once per device)
        </li>
      </ul>

      <h2>Why You Should Use a Password Manager</h2>
      <p>
        Random passwords are only useful if you can remember them—and you
        shouldn&apos;t try. Instead, use a password manager like Bitwarden,
        1Password, or KeePass to store your generated passwords securely. This
        allows you to:
      </p>
      <ul>
        <li>Use unique passwords for every account</li>
        <li>Generate and store complex passwords without memorization</li>
        <li>Autofill credentials securely across devices</li>
        <li>
          Detect if any of your passwords have been compromised in data breaches
        </li>
      </ul>

      <h2>The Math Behind Password Security</h2>
      <p>
        Password strength is measured in bits of entropy. A password with 20
        characters using all character types (uppercase, lowercase, digits, and
        special characters—roughly 95 possible characters) has about 131 bits of
        entropy. At current computing speeds, cracking such a password through
        brute force would take longer than the age of the universe.
      </p>
    </ContentWrapper>
  );
}
