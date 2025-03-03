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
    </ContentWrapper>
  );
}
