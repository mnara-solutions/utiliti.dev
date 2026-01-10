import { useState } from "react";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import Copy from "~/components/copy";
import { ClientOnly } from "~/components/client-only";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Slider from "~/components/slider";
import Checkbox from "~/components/checkbox";

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
    avgWordsPerSentence + stDev,
  );
  const midPunc = midPunctuation(sentenceLength);
  const sentence = Array.from(
    Array(sentenceLength),
    (_, i) =>
      getRandomWord() + (i === midPunc.position ? midPunc.punctuation : ""),
  ).join(" ");

  return (
    sentence.charAt(0).toUpperCase() + sentence.slice(1) + endPunctuation()
  );
}

function createParagraph(
  firstParagraph: boolean,
  avgWordsPerSentence: number,
  avgSentencesPerParagraph: number,
  startWithLoremIpsum: boolean,
): string {
  const stDev = getStandardDeviation(avgSentencesPerParagraph, 0.25);
  const paragraphLength = positiveRandom(
    avgSentencesPerParagraph - stDev,
    avgSentencesPerParagraph + stDev,
  );

  return Array.from(Array(paragraphLength), (_, i) =>
    i === 0 && firstParagraph && startWithLoremIpsum
      ? "Lorem ipsum odor amet, consectetuer adipiscing elit."
      : createSentence(avgWordsPerSentence),
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
  startWithLoremIpsum: boolean,
): string[] {
  return Array.from(Array(paragraphs), (_, i) =>
    createParagraph(
      i === 0,
      avgWordsPerSentence,
      avgSentencesPerParagraph,
      startWithLoremIpsum,
    ),
  );
}

export const meta = metaHelper(
  utilities.loremIpsum.name,
  "Generate Lorem Ipsum placeholder text instantly. Customizable paragraphs, sentences, and word counts—all generated privately in your browser.",
);

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(5);
  const [awps, setAwps] = useState(8); // average words per sentence
  const [aspp, setAspp] = useState(8); // average sentences per paragraph
  const [swdsa, setSwdsa] = useState(true); // start with dolor sit amet
  const output = generateLoremIpsum(paragraphs, aspp, awps, swdsa);

  return (
    <ContentWrapper>
      <h1>{utilities.loremIpsum.name}</h1>

      <p>
        Generate placeholder text for your designs, mockups, and prototypes.
        Customize the length and structure to fit your needs.
      </p>

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

      <ClientOnly>
        {() => (
          <Box className="mt-6">
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

      <h2>What is Lorem Ipsum?</h2>
      <p>
        Lorem Ipsum is placeholder text commonly used in the design and
        typesetting industry. It has been the industry&apos;s standard dummy
        text since the 1500s, when an unknown printer scrambled a section of
        Cicero&apos;s &quot;De Finibus Bonorum et Malorum&quot; to create a type
        specimen book.
      </p>
      <p>
        The text is intentionally meaningless, which allows designers and
        developers to focus on visual elements like typography, layout, and
        spacing without being distracted by readable content.
      </p>

      <h2>Why Use Lorem Ipsum?</h2>
      <ul>
        <li>
          <strong>Focus on Design</strong>: Meaningless text lets viewers focus
          on visual elements rather than reading content
        </li>
        <li>
          <strong>Realistic Text Flow</strong>: Unlike repeating &quot;text text
          text,&quot; Lorem Ipsum mimics natural language patterns with varied
          word lengths
        </li>
        <li>
          <strong>Industry Standard</strong>: Clients and stakeholders recognize
          it as placeholder content
        </li>
        <li>
          <strong>Neutral Content</strong>: Avoids potentially offensive or
          distracting placeholder text
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Adjustable Length</strong>: Generate 1 to 50 paragraphs of
          text
        </li>
        <li>
          <strong>Sentence Control</strong>: Set average words per sentence
          (4-20)
        </li>
        <li>
          <strong>Paragraph Density</strong>: Control average sentences per
          paragraph (4-20)
        </li>
        <li>
          <strong>Traditional Start</strong>: Option to begin with the classic
          &quot;Lorem ipsum dolor sit amet...&quot;
        </li>
        <li>
          <strong>Natural Variation</strong>: Randomized punctuation and
          sentence lengths for realistic text
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Set paragraph count</strong>: Use the slider to choose how
          many paragraphs you need
        </li>
        <li>
          <strong>Adjust density</strong>: Configure words per sentence and
          sentences per paragraph to match your layout
        </li>
        <li>
          <strong>Choose opening</strong>: Toggle whether to start with the
          traditional &quot;Lorem ipsum&quot; phrase
        </li>
        <li>
          <strong>Copy the output</strong>: Click the copy button to grab your
          generated text
        </li>
      </ol>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Web Design Mockups</strong>: Fill page layouts with realistic
          text before final content is ready
        </li>
        <li>
          <strong>Print Layouts</strong>: Test typography and spacing in
          brochures, magazines, and books
        </li>
        <li>
          <strong>App Prototypes</strong>: Populate UI components with
          placeholder content during development
        </li>
        <li>
          <strong>Presentation Templates</strong>: Fill slide layouts to
          demonstrate design without final copy
        </li>
        <li>
          <strong>Font Testing</strong>: Evaluate typefaces with substantial
          text samples
        </li>
      </ul>

      <h2>The History of Lorem Ipsum</h2>
      <p>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        derives from sections 1.10.32 and 1.10.33 of &quot;De Finibus Bonorum et
        Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45
        BC. This philosophical work on ethics was popular during the Renaissance
        and was used by typesetters as sample text.
      </p>
      <p>
        The standard Lorem Ipsum passage has been used since the 1500s and was
        popularized in the 1960s with the release of Letraset sheets containing
        Lorem Ipsum passages, and more recently with desktop publishing software
        like Aldus PageMaker.
      </p>
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
