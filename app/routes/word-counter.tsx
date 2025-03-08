import Box, { BoxContent, BoxInfo, BoxTitle } from "~/components/box";
import Copy from "~/components/copy";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { useEffect, useRef, useState } from "react";
import { throttle } from "~/utils/throttle";
import ContentWrapper from "~/components/content-wrapper";
import { Transition } from "@headlessui/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { useLocalStorage } from "~/hooks/use-local-storage";

export const meta = metaHelper(
  utilities.wordCounter.name,
  utilities.wordCounter.description,
);

interface Info {
  readonly sentences: number;
  readonly words: number;
  readonly characters: number;
  readonly all: number;
  readonly paragraphs: number;
  readonly topWords: { word: string; count: number }[];
}

/**
 * `ucs2decode` function from the punycode.js library.
 *
 * Creates an array containing the decimal code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally, this
 * function will convert a pair of surrogate halves (each of which UCS-2
 * exposes as separate characters) into a single code point, matching
 * UTF-16.
 *
 * @see     <http://goo.gl/8M09r>
 * @see     <http://goo.gl/u4UUC>
 *
 * @param   {String}  input   The Unicode input string (UCS-2).
 *
 * @return  {Array}   The new array of code points.
 */
function decode(input: string): number[] {
  const output = [];
  let counter = 0;
  const length = input.length;

  while (counter < length) {
    const value = input.charCodeAt(counter++);

    if (value >= 0xd800 && value <= 0xdbff && counter < length) {
      // It's a high surrogate, and there is a next character.
      const extra = input.charCodeAt(counter++);

      if ((extra & 0xfc00) == 0xdc00) {
        // Low surrogate.
        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }

  return output;
}

function topWords(
  input: string,
  filterCommonWords: boolean,
): { word: string; count: number }[] {
  // unique words
  const words: string[] = input.toLowerCase().match(/[\w'-]+/g) || [];
  const filteredWords = filterCommonWords
    ? words.filter((it) => !commonWords.has(it))
    : words;

  // count the words
  const countHash = filteredWords.reduce<Record<string, number>>((acc, it) => {
    acc[it] = (acc[it] || 0) + 1;

    return acc;
  }, {});

  return Object.keys(countHash)
    .sort((a, b) => countHash[b] - countHash[a])
    .slice(0, 10)
    .map((it) => ({ word: it, count: countHash[it] }));
}

interface Options {
  readonly filterCommonWords: boolean;
}

/**
 * Taken from https://github.com/RadLikeWhoa/Countable/blob/master/Countable.js#L149-L152.
 *
 * @param input
 * @param options
 */
function count(input: string, { filterCommonWords = true }: Options): Info {
  const trimmed = input.trim();
  const cleaned = trimmed
    .replace(/\s-+/g, " ")
    .replace(/-+\s/g, " ")
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/–/g, "-")
    .replace(/…/g, "...");

  return {
    sentences: cleaned ? (cleaned.match(/[.?!…]+./g) || []).length + 1 : 0,
    words: (cleaned.replace(/['";:,.?¿\-!¡]+/g, "").match(/\S+/g) || []).length,
    characters: decode(cleaned.replace(/\s/g, "")).length,
    all: decode(input).length,
    topWords: topWords(cleaned, filterCommonWords),
    paragraphs: cleaned.match(/(\n\n?|^).+?(?=\n?\n?|$)/g)?.length || 0,
  };
}

function formatTime(words: number, speed: number) {
  const num = (words / speed) * 60;

  if (num < 60) {
    return `${Math.floor(num)} sec`;
  }

  return `${Math.floor(num / 60)} min ${Math.floor(num % 60)} sec`;
}
export default function WordCounter() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hadSelected = useRef(false);
  const [content, setContent] = useLocalStorage("word-counter", "");
  const [options, setOptions] = useLocalStorage<Options>(
    "word-counter-options",
    { filterCommonWords: true },
    true,
  );
  const [info, setInfo] = useState<Info>(count(content, options));

  const throttledSetContent = throttle(setContent, 1000);

  // text change handler
  const onChange = () => {
    if (!inputRef.current) {
      return;
    }

    throttledSetContent(inputRef.current.value || "");
  };

  // whenever text changes (storage backend), re-calculate info
  useEffect(() => {
    setInfo(count(content, options));
  }, [content, options]);

  // on highlight of text, only perform logic on selection
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const handler = () => {
      if (!inputRef.current) {
        return;
      }

      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const hasSelection = start != end;

      if (hasSelection) {
        setInfo(count(inputRef.current.value.substring(start, end), options));
      } else if (hadSelected.current) {
        setInfo(count(inputRef?.current?.value || "", options));
      }

      hadSelected.current = hasSelection;
    };

    document.addEventListener("mouseup", handler);

    return () => document.removeEventListener("mouseup", handler);
  }, [setInfo, options]);

  return (
    <ContentWrapper>
      <h1>Word Counter</h1>

      <p>
        A utility that allows you to easily see analytical information about the
        content you have typed. Pro-tip: Highlight a sub-section of your text to
        narrow down which text the utility analyzes.
      </p>

      <Box>
        <BoxTitle title="Input">
          <div>
            <Copy content={() => inputRef.current?.value || ""} />
          </div>
        </BoxTitle>

        <BoxContent isLast={false} className="max-h-full">
          <textarea
            ref={inputRef}
            className="block w-full h-56 lg:h-96 lg:text-sm px-3 py-2 border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400 break-words"
            placeholder="Start typing or paste in your text here…"
            onChange={onChange}
            defaultValue={content}
          ></textarea>
        </BoxContent>

        <BoxInfo>
          <div className="flex w-full justify-between">
            <div>
              {info.sentences.toLocaleString()} sentence
              {info.sentences === 1 ? "" : "s"}
            </div>
            <div>
              {info.words.toLocaleString()} word
              {info.words === 1 ? "" : "s"}
            </div>
            <div>
              {info.all.toLocaleString()} character
              {info.all === 1 ? "" : "s"}
            </div>
          </div>
        </BoxInfo>
      </Box>

      <Transition
        show={info.words !== 0}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="mt-6"
        as="div"
      >
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-x-3 gap-y-6">
          <div className="flex flex-col w-full border rounded-lg bg-zinc-700 border-zinc-600">
            <div className="px-3 py-2 border-b border-gray-600 font-bold">
              Detail
            </div>
            <div className="flex grow bg-zinc-800 not-prose rounded-b-lg">
              <div className="w-full">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-zinc-600">
                      <td className="px-3 py-2">Words</td>
                      <td className="px-3 py-2">{info.words}</td>
                    </tr>
                    <tr className="border-b border-zinc-600">
                      <td className="px-3 py-2">Characters</td>
                      <td className="px-3 py-2">{info.characters}</td>
                    </tr>
                    <tr className="border-b border-zinc-600">
                      <td className="px-3 py-2">Sentences</td>
                      <td className="px-3 py-2">{info.sentences}</td>
                    </tr>
                    <tr className="border-b border-zinc-600">
                      <td className="px-3 py-2">Paragraphs</td>
                      <td className="px-3 py-2">{info.paragraphs}</td>
                    </tr>
                    <tr className="border-b border-zinc-600">
                      <td className="px-3 py-2">Reading Time</td>

                      <td className="flex px-3 py-2">
                        <div className="pr-2">
                          {formatTime(info.words, 275)}
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <QuestionMarkCircleIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="inline-block px-2 py-1 text-sm font-medium text-white rounded-lg shadow-xs bg-zinc-700">
                            Based on an average reading speed of 275 words per
                            minute.
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Speaking Time</td>
                      <td className="flex px-3 py-2">
                        <div className="pr-2">
                          {formatTime(info.words, 180)}
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <QuestionMarkCircleIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="inline-block px-2 py-1 text-sm font-medium text-white rounded-lg shadow-xs bg-zinc-700">
                            Based on an average speaking speed of 180 words per
                            minute.
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full border rounded-lg bg-zinc-700 border-zinc-600">
            <BoxTitle title="Top Words">
              <div className="flex">
                <div className="flex items-center h-5 w-5 ml-2">
                  <input
                    id="filter-common-words"
                    type="checkbox"
                    checked={options.filterCommonWords}
                    className="w-4 h-4 border rounded-sm focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
                    onChange={(e) => {
                      setOptions({
                        ...options,
                        filterCommonWords: e.target.checked,
                      });
                    }}
                  />
                </div>
                <label
                  htmlFor="filter-common-words"
                  className="ml-2 text-sm font-medium text-gray-300"
                >
                  Filter Common Words
                </label>
              </div>
            </BoxTitle>

            <div className="flex grow bg-zinc-800 not-prose rounded-b-lg">
              <div className="w-full">
                <table className="w-full">
                  <tbody>
                    {info.topWords.map((it, i) => (
                      <tr
                        key={it.word}
                        className={
                          i === info.topWords.length - 1
                            ? ""
                            : "border-b border-zinc-600"
                        }
                      >
                        <td className="px-3 py-2">{`${it.word} (${it.count})`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </ContentWrapper>
  );
}

const commonWords = new Set([
  "&",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "aaliyah",
  "aaron",
  "abby",
  "abel",
  "abigail",
  "adalyn",
  "adalynn",
  "adam",
  "addison",
  "adeline",
  "adelyn",
  "adrian",
  "adriana",
  "ahmad",
  "aidan",
  "aiden",
  "aj ",
  "alaina",
  "alana",
  "alayna",
  "alejandro",
  "alex",
  "alexa",
  "alexander",
  "alexandra",
  "alexandria",
  "alexis",
  "ali",
  "alice",
  "alina",
  "alivia",
  "aliyah",
  "allie",
  "allison",
  "alyssa",
  "am",
  "amaya",
  "amelia",
  "amir",
  "an",
  "ana",
  "anastasia",
  "anaya",
  "and",
  "andrea",
  "andrew",
  "angel",
  "angelina",
  "anna",
  "annabelle",
  "anthony",
  "antonio",
  "arabella",
  "archer",
  "are",
  "aren't",
  "aria",
  "ariana",
  "arianna",
  "ariel",
  "arthur",
  "arya",
  "as",
  "asher",
  "ashton",
  "at",
  "athena",
  "aubree",
  "aubrey",
  "audrey",
  "august",
  "aurora",
  "austin",
  "autumn",
  "ava",
  "avery",
  "axel",
  "ayden",
  "ayla",
  "b",
  "bailey",
  "be",
  "beau",
  "beckett",
  "bella",
  "ben",
  "benjamin",
  "bennett",
  "bentley",
  "blake",
  "bradley",
  "brady",
  "brandon",
  "brantley",
  "braxton",
  "brayden",
  "brian",
  "brianna",
  "brielle",
  "brody",
  "brooke",
  "brooklyn",
  "brooklynn",
  "brooks",
  "bryce",
  "brynn",
  "bryson",
  "but",
  "by",
  "c",
  "caden",
  "caiden",
  "caleb",
  "callie",
  "calvin",
  "camden",
  "cameron",
  "camila",
  "camille",
  "can",
  "can't",
  "cannot",
  "cant",
  "carlos",
  "caroline",
  "carson",
  "carter",
  "cash",
  "cayden",
  "cecilia",
  "charles",
  "charlie",
  "charlotte",
  "chase",
  "chloe",
  "christian",
  "christopher",
  "claire",
  "clara",
  "cole",
  "colin",
  "colton",
  "conner",
  "connor",
  "cooper",
  "cora",
  "corbin",
  "d",
  "daisy",
  "damian",
  "damien",
  "daniel",
  "dante",
  "david",
  "dean",
  "declan",
  "delaney",
  "delilah",
  "derek",
  "did",
  "didn't",
  "diego",
  "do",
  "does",
  "doesn't",
  "doing",
  "dominic",
  "don't",
  "done",
  "drew",
  "dylan",
  "e",
  "easton",
  "eden",
  "edward",
  "eleanor",
  "elena",
  "eli",
  "eliana",
  "elias",
  "elijah",
  "elise",
  "eliza",
  "elizabeth",
  "ella",
  "ellie",
  "elliot",
  "elliott",
  "eloise",
  "emerson",
  "emery",
  "emilia",
  "emily",
  "emma",
  "emmanuel",
  "emmett",
  "enzo",
  "eric",
  "erin",
  "etc",
  "ethan",
  "eva",
  "evan",
  "evangeline",
  "evelyn",
  "everett",
  "everly",
  "evie",
  "ex",
  "ezekiel",
  "ezra",
  "f",
  "faith",
  "felix",
  "finley",
  "finn",
  "fiona",
  "for",
  "from",
  "g",
  "gabriel",
  "gabriela",
  "gabriella",
  "gabrielle",
  "gage",
  "garrett",
  "gavin",
  "genesis",
  "genevieve",
  "george",
  "georgia",
  "gia",
  "gianna",
  "giovanni",
  "got",
  "grace",
  "gracie",
  "graham",
  "grant",
  "grayson",
  "greyson",
  "griffin",
  "h",
  "had",
  "hadley",
  "hadn't",
  "hailey",
  "hannah",
  "harmony",
  "harper",
  "harrison",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "hayden",
  "hazel",
  "he",
  "he'd",
  "he'll",
  "he's",
  "helena",
  "henry",
  "her",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "hudson",
  "hunter",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "ian",
  "if",
  "in",
  "into",
  "iris",
  "is",
  "isaac",
  "isabel",
  "isabella",
  "isabelle",
  "isaiah",
  "isla",
  "isn't",
  "it",
  "it'd",
  "it'll",
  "it's",
  "its",
  "itself",
  "ivan",
  "ivy",
  "j",
  "jace",
  "jack",
  "jackson",
  "jacob",
  "jade",
  "jaden",
  "jake",
  "james",
  "jameson",
  "jase",
  "jasmine",
  "jason",
  "jasper",
  "jax",
  "jaxon",
  "jaxson",
  "jayce",
  "jayden",
  "jeremiah",
  "jeremy",
  "jesse",
  "jocelyn",
  "joel",
  "joey",
  "john",
  "jonah",
  "jonathan",
  "jordan",
  "jordyn",
  "jose",
  "joseph",
  "josephine",
  "joshua",
  "josiah",
  "josie",
  "juan",
  "judah",
  "jude",
  "julia",
  "julian",
  "juliana",
  "julianna",
  "juliette",
  "justin",
  "kaden",
  "kai",
  "kaiden",
  "kaitlyn",
  "kaleb",
  "karter",
  "kate",
  "katelyn",
  "katherine",
  "katie",
  "kayden",
  "kayla",
  "kaylee",
  "keira",
  "kendall",
  "kennedy",
  "kenzie",
  "kevin",
  "khloe",
  "kingston",
  "kinley",
  "kinsley",
  "kyle",
  "kylie",
  "laila",
  "lana",
  "landon",
  "lara",
  "laura",
  "lauren",
  "layla",
  "leah",
  "leila",
  "leilani",
  "lena",
  "leo",
  "leon",
  "leonardo",
  "levi",
  "lexi",
  "liam",
  "lila",
  "liliana",
  "lillian",
  "lilly",
  "lily",
  "lincoln",
  "logan",
  "lola",
  "london",
  "londyn",
  "lorenzo",
  "luca",
  "lucas",
  "lucia",
  "lucy",
  "luis",
  "lukas",
  "luke",
  "luna",
  "lydia",
  "lyla",
  "mackenzie",
  "maddox",
  "madeline",
  "madelyn",
  "madison",
  "maggie",
  "makayla",
  "makenzie",
  "malachi",
  "marcus",
  "maria",
  "mariah",
  "mark",
  "marley",
  "mary",
  "maryam",
  "mason",
  "mateo",
  "matteo",
  "matthew",
  "maverick",
  "max",
  "maximus",
  "maxwell",
  "maya",
  "mckenna",
  "mckenzie",
  "me",
  "melanie",
  "melody",
  "mia",
  "micah",
  "michael",
  "miguel",
  "mikayla",
  "mila",
  "miles",
  "milo",
  "mohammed",
  "molly",
  "morgan",
  "mr",
  "mrs",
  "muhammad",
  "my",
  "mya",
  "myles",
  "myself",
  "naomi",
  "natalia",
  "natalie",
  "nathan",
  "nathaniel",
  "nevaeh",
  "nicholas",
  "nicolas",
  "nicole",
  "nina",
  "no",
  "noah",
  "noelle",
  "nolan",
  "nora",
  "norah",
  "not",
  "nova",
  "nur",
  "of",
  "off",
  "oh",
  "ok",
  "okay",
  "olive",
  "oliver",
  "olivia",
  "omar",
  "on",
  "or",
  "oscar",
  "our",
  "ours",
  "ourselves",
  "out",
  "owen",
  "paige",
  "paisley",
  "parker",
  "patrick",
  "paul",
  "paxton",
  "payton",
  "penelope",
  "per",
  "peter",
  "peyton",
  "phoebe",
  "piper",
  "presley",
  "preston",
  "quinn",
  "rachel",
  "raelynn",
  "rafael",
  "reagan",
  "rebecca",
  "reese",
  "reid",
  "richard",
  "riley",
  "river",
  "robert",
  "roman",
  "rose",
  "rowan",
  "ruby",
  "ryan",
  "ryder",
  "ryker",
  "rylan",
  "rylee",
  "ryleigh",
  "sadie",
  "said",
  "sam",
  "samantha",
  "samuel",
  "santiago",
  "sara",
  "sarah",
  "savannah",
  "sawyer",
  "scarlett",
  "sean",
  "sebastian",
  "serenity",
  "seth",
  "she",
  "she'd",
  "she'll",
  "she's",
  "sienna",
  "silas",
  "simon",
  "skylar",
  "so",
  "sofia",
  "sophia",
  "sophie",
  "spencer",
  "stella",
  "summer",
  "sydney",
  "talia",
  "tanner",
  "taylor",
  "teagan",
  "tessa",
  "than",
  "that",
  "that'll",
  "that's",
  "that've",
  "thats",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "theo",
  "theodore",
  "there",
  "there'd",
  "there'll",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "thomas",
  "those",
  "timothy",
  "to",
  "too",
  "trinity",
  "tristan",
  "tucker",
  "tyler",
  "up",
  "us",
  "use",
  "used",
  "uses",
  "valentina",
  "valerie",
  "victor",
  "victoria",
  "vincent",
  "violet",
  "vivian",
  "vivienne",
  "was",
  "wasn't",
  "way",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "well",
  "went",
  "were",
  "weren't",
  "wesley",
  "weston",
  "what",
  "what's",
  "where",
  "where's",
  "which",
  "who",
  "who'd",
  "who'll",
  "who's",
  "whose",
  "why",
  "will",
  "william",
  "willow",
  "with",
  "won't",
  "would",
  "wouldn't",
  "wyatt",
  "xander",
  "xavier",
  "yes",
  "yet",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "zachary",
  "zander",
  "zane",
  "zara",
  "zayden",
  "zion",
  "zoe",
  "zoey",
]);
