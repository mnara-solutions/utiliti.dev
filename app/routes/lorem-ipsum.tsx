import type { ChangeEventHandler } from "react";
import { useState } from "react";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import Copy from "~/components/copy";
import { ClientOnly } from "~/components/client-only";
import type { MetaFunction } from "@remix-run/cloudflare";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";

function random(min: number, max: number) {
  return Math.round(Math.random() * (max - min)) + min;
}

function positiveRandom(min: number, max: number) {
  return Math.max(1, random(min, max));
}

function getStandardDeviation(value: number, percentage: number) {
  return Math.ceil(value * percentage);
}

function getRandomWord() {
  return words[random(0, words.length - 1)];
}

function midPunctuation(sentenceLength: number) {
  const punctuations = [",", ";"];

  if (sentenceLength > 6 && Math.random() <= 0.25) {
    return {
      position: random(2, sentenceLength - 3),
      punctuation: punctuations[random(0, punctuations.length - 1)],
    };
  }

  return { punctuation: null, position: null };
}

/**
 * 1% probability exclamation mark, 4% probability question mark, 95% probability dot
 */
function endPunctuation() {
  const random = Math.random();

  if (random > 0.99) {
    return "!";
  } else if (random > 0.95) {
    return "?";
  }

  return ".";
}

function createSentence(avgWordsPerSentence: number): string {
  const stDev = getStandardDeviation(avgWordsPerSentence, 0.25);
  const sentenceLength = positiveRandom(
    avgWordsPerSentence - stDev,
    avgWordsPerSentence + stDev
  );
  const midPunc = midPunctuation(sentenceLength);
  const sentence = Array.from(
    Array(sentenceLength),
    (_, i) =>
      getRandomWord() + (i === midPunc.position ? midPunc.punctuation : "")
  ).join(" ");

  return (
    sentence.charAt(0).toUpperCase() + sentence.slice(1) + endPunctuation()
  );
}

function createParagraph(
  firstParagraph: boolean,
  avgWordsPerSentence: number,
  avgSentencesPerParagraph: number,
  startWithLoremIpsum: boolean
): string {
  const stDev = getStandardDeviation(avgSentencesPerParagraph, 0.25);
  const paragraphLength = positiveRandom(
    avgSentencesPerParagraph - stDev,
    avgSentencesPerParagraph + stDev
  );

  return Array.from(Array(paragraphLength), (_, i) =>
    i === 0 && firstParagraph && startWithLoremIpsum
      ? "Lorem ipsum odor amet, consectetuer adipiscing elit."
      : createSentence(avgWordsPerSentence)
  ).join(" ");
}

/**
 * Heavily inspired by https://github.com/fatihtelis/react-lorem-ipsum/blob/master/src/lorem-ipsum/index.js, but mostly
 * rewritten to be a little more opinionated.
 *
 * @param paragraphs
 * @param avgSentencesPerParagraph
 * @param avgWordsPerSentence
 * @param startWithLoremIpsum
 */
function generateLoremIpsum(
  paragraphs: number,
  avgSentencesPerParagraph: number,
  avgWordsPerSentence: number,
  startWithLoremIpsum: boolean
): string[] {
  return Array.from(Array(paragraphs), (_, i) =>
    createParagraph(
      i === 0,
      avgWordsPerSentence,
      avgSentencesPerParagraph,
      startWithLoremIpsum
    )
  );
}

function Checkbox({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <div className="flex items-center">
        <input
          id={id}
          onChange={onChange}
          checked={value}
          type="checkbox"
          className="w-4 h-4 border rounded focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
        />

        <label htmlFor={id} className="ml-2 text-sm font-medium text-white">
          {label}
        </label>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full lg:w-1/2 h-2 mb-2 accent-orange-500 rounded-lg appearance-none cursor-pointer bg-dark-700"
      />
    </div>
  );
}

export const meta: MetaFunction = () =>
  metaHelper(utilities.loremIpsum.name, utilities.loremIpsum.description);

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(5);
  const [awps, setAwps] = useState(8); // average words per sentence
  const [aspp, setAspp] = useState(8); // average sentences per paragraph
  const [swdsa, setSwdsa] = useState(true); // start with dolor sit amet
  const output = generateLoremIpsum(paragraphs, aspp, awps, swdsa);

  return (
    <ContentWrapper>
      <h1>Lorem Ipsum</h1>

      <Box>
        <BoxTitle title="Settings" />

        <BoxContent isLast={true} className="px-3 py-2 flex flex-col gap-y-2">
          <Slider
            id="paragraphs"
            label={`Paragraphs (${paragraphs})`}
            value={paragraphs}
            min={1}
            max={50}
            onChange={setParagraphs}
          />

          <Slider
            id="aspp"
            label={`Average Words per Sentence (${awps})`}
            value={awps}
            min={4}
            max={20}
            onChange={setAwps}
          />

          <Slider
            id="aspp"
            label={`Average Sentences per Paragraph (${aspp})`}
            value={aspp}
            min={4}
            max={20}
            onChange={setAspp}
          />

          <Checkbox
            id="swdsa"
            label={`Start with “Lorem ipsum odor amet, …”`}
            value={swdsa}
            onChange={(e) => setSwdsa(e.target.checked)}
          />
        </BoxContent>
      </Box>

      <div className="h-4" />

      <ClientOnly>
        {() => (
          <Box>
            <BoxTitle title="Output">
              <div>
                <Copy content={output.join("\n\n")} />
              </div>
            </BoxTitle>

            <div className="bg-zinc-800 rounded-b-lg px-3 py-0.5">
              {output.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Box>
        )}
      </ClientOnly>
    </ContentWrapper>
  );
}

const words = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "quisque",
  "faucibus",
  "ex",
  "sapien",
  "vitae",
  "pellentesque",
  "sem",
  "placerat",
  "in",
  "id",
  "cursus",
  "mi",
  "pretium",
  "tellus",
  "duis",
  "convallis",
  "tempus",
  "leo",
  "eu",
  "aenean",
  "sed",
  "diam",
  "urna",
  "tempor",
  "pulvinar",
  "vivamus",
  "fringilla",
  "lacus",
  "nec",
  "metus",
  "bibendum",
  "egestas",
  "iaculis",
  "massa",
  "nisl",
  "malesuada",
  "lacinia",
  "integer",
  "nunc",
  "posuere",
  "ut",
  "hendrerit",
  "semper",
  "vel",
  "class",
  "aptent",
  "taciti",
  "sociosqu",
  "ad",
  "litora",
  "torquent",
  "per",
  "conubia",
  "nostra",
  "inceptos",
  "himenaeos",
  "orci",
  "varius",
  "natoque",
  "penatibus",
  "et",
  "magnis",
  "dis",
  "parturient",
  "montes",
  "nascetur",
  "ridiculus",
  "mus",
  "donec",
  "rhoncus",
  "eros",
  "lobortis",
  "nulla",
  "molestie",
  "mattis",
  "scelerisque",
  "maximus",
  "eget",
  "fermentum",
  "odio",
  "phasellus",
  "non",
  "purus",
  "est",
  "efficitur",
  "laoreet",
  "mauris",
  "pharetra",
  "vestibulum",
  "fusce",
  "dictum",
  "risus",
  "blandit",
  "quis",
  "suspendisse",
  "aliquet",
  "nisi",
  "sodales",
  "consequat",
  "magna",
  "ante",
  "condimentum",
  "neque",
  "at",
  "luctus",
  "nibh",
  "finibus",
  "facilisis",
  "dapibus",
  "etiam",
  "interdum",
  "tortor",
  "ligula",
  "congue",
  "sollicitudin",
  "erat",
  "viverra",
  "ac",
  "tincidunt",
  "nam",
  "porta",
  "elementum",
  "a",
  "enim",
  "euismod",
  "quam",
  "justo",
  "lectus",
  "commodo",
  "augue",
  "arcu",
  "dignissim",
  "velit",
  "aliquam",
  "imperdiet",
  "mollis",
  "nullam",
  "volutpat",
  "porttitor",
  "ullamcorper",
  "rutrum",
  "gravida",
  "cras",
  "eleifend",
  "turpis",
  "fames",
  "primis",
  "vulputate",
  "ornare",
  "sagittis",
  "vehicula",
  "praesent",
  "dui",
  "felis",
  "venenatis",
  "ultrices",
  "proin",
  "libero",
  "feugiat",
  "tristique",
  "accumsan",
  "maecenas",
  "potenti",
  "ultricies",
  "habitant",
  "morbi",
  "senectus",
  "netus",
  "suscipit",
  "auctor",
  "curabitur",
  "facilisi",
  "cubilia",
  "curae",
  "hac",
  "habitasse",
  "platea",
  "dictumst",
];
