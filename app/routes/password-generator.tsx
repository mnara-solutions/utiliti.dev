import { useState } from "react";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import { ClientOnly } from "~/components/client-only";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Slider from "~/components/slider";
import Checkbox from "~/components/checkbox";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import Copy from "~/components/copy";

export const meta = metaHelper(
  utilities.password.name,
  utilities.password.description,
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

  let array = new Uint8Array(1);

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
  const [characters, setCharacters] = useState(20);
  const [useUpperCase, setUseUpperCase] = useState(true);
  const [useLowerCase, setLowerUpperCase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const output = generatePassword(
    characters,
    useUpperCase,
    useLowerCase,
    useDigits,
    useSpecial,
  );

  return (
    <ContentWrapper>
      <h1>Password Generate</h1>

      <Box>
        <BoxTitle title="Settings" />

        <BoxContent isLast={true} className="px-3 py-2 flex flex-col gap-y-2">
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
      </Box>

      <ClientOnly>
        {() => (
          <Box className="mt-6">
            <BoxTitle title="Output">
              <div>
                <Copy content={output} />
              </div>
            </BoxTitle>
            <BoxContent isLast={true}>
              <ReadOnlyTextArea value={output} />
            </BoxContent>
          </Box>
        )}
      </ClientOnly>
    </ContentWrapper>
  );
}
