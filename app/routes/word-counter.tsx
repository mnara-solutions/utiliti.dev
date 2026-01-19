import Box, { BoxContent, BoxInfo, BoxTitle } from "~/components/box";
import Copy from "~/components/copy";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { Routes } from "~/routes";
import { useEffect, useRef, useState } from "react";
import { throttle } from "~/utils/throttle";
import ContentWrapper from "~/components/content-wrapper";

// Lazy-loaded common words - cached after first load
let commonWordsCache: Set<string> | null = null;
let commonWordsPromise: Promise<Set<string>> | null = null;

async function getCommonWords(): Promise<Set<string>> {
  if (commonWordsCache) {
    return commonWordsCache;
  }

  if (!commonWordsPromise) {
    commonWordsPromise = import("~/data/common-words").then((mod) => {
      commonWordsCache = mod.commonWords;
      return commonWordsCache;
    });
  }

  return commonWordsPromise;
}
import FadeIn from "~/components/fade-in";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { useLocalStorage } from "~/hooks/use-local-storage";

export const meta = metaHelper(
  utilities.wordCounter.name,
  "Count words, characters, sentences, and paragraphs instantly. Get reading time estimates and word frequency analysis—all processing happens privately in your browser.",
  Routes.WORD_COUNTER,
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
  commonWords: Set<string> | null,
): { word: string; count: number }[] {
  // unique words
  const words: string[] = input.toLowerCase().match(/[\w'-]+/g) || [];
  const filteredWords =
    filterCommonWords && commonWords
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
function count(
  input: string,
  { filterCommonWords = true }: Options,
  commonWords: Set<string> | null,
): Info {
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
    topWords: topWords(cleaned, filterCommonWords, commonWords),
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
  const [commonWords, setCommonWords] = useState<Set<string> | null>(
    commonWordsCache,
  );
  const [info, setInfo] = useState<Info>(count(content, options, commonWords));

  const throttledSetContent = throttle(setContent, 1000);

  // Lazy load common words when filter option is enabled
  useEffect(() => {
    if (options.filterCommonWords && !commonWords) {
      getCommonWords().then(setCommonWords);
    }
  }, [options.filterCommonWords, commonWords]);

  // text change handler
  const onChange = () => {
    if (!inputRef.current) {
      return;
    }

    throttledSetContent(inputRef.current.value || "");
  };

  // whenever text changes (storage backend), re-calculate info
  useEffect(() => {
    setInfo(count(content, options, commonWords));
  }, [content, options, commonWords]);

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
        setInfo(
          count(
            inputRef.current.value.substring(start, end),
            options,
            commonWords,
          ),
        );
      } else if (hadSelected.current) {
        setInfo(count(inputRef?.current?.value || "", options, commonWords));
      }

      hadSelected.current = hasSelection;
    };

    document.addEventListener("mouseup", handler);

    return () => document.removeEventListener("mouseup", handler);
  }, [setInfo, options, commonWords]);

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

      <FadeIn show={info.words !== 0} className="mt-6">
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
      </FadeIn>

      <h2>Why Use Utiliti&apos;s Word Counter?</h2>
      <p>
        Writers, students, and professionals often work with sensitive
        content—confidential reports, unpublished manuscripts, private
        correspondence, or proprietary documentation. Many online word counters
        send your text to their servers for analysis.
      </p>
      <p>
        Utiliti&apos;s Word Counter runs{" "}
        <strong>entirely in your browser</strong>. Your text never leaves your
        device, making it safe to analyze:
      </p>
      <ul>
        <li>
          <strong>Confidential Documents</strong>: Count words in sensitive
          business reports without exposure
        </li>
        <li>
          <strong>Unpublished Work</strong>: Analyze drafts of articles, books,
          or papers privately
        </li>
        <li>
          <strong>Client Content</strong>: Work with client materials without
          violating NDAs
        </li>
        <li>
          <strong>Personal Writing</strong>: Keep journals and private notes
          truly private
        </li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Comprehensive Counts</strong>: Get word, character, sentence,
          and paragraph counts instantly
        </li>
        <li>
          <strong>Reading Time</strong>: Estimated reading time based on 275
          words per minute average
        </li>
        <li>
          <strong>Speaking Time</strong>: Estimated speaking time based on 180
          words per minute average
        </li>
        <li>
          <strong>Top Words Analysis</strong>: See the most frequently used
          words in your text
        </li>
        <li>
          <strong>Selection Support</strong>: Highlight a portion of text to
          analyze just that selection
        </li>
        <li>
          <strong>Common Words Filter</strong>: Option to exclude common words
          (the, and, is, etc.) from top words analysis
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Enter your text</strong>: Type or paste your content into the
          input area
        </li>
        <li>
          <strong>View statistics</strong>: Word, sentence, and character counts
          appear immediately below the input
        </li>
        <li>
          <strong>Analyze sections</strong>: Highlight any portion of text with
          your mouse to see stats for just that selection
        </li>
        <li>
          <strong>Review top words</strong>: Check the Top Words panel to see
          your most frequently used terms
        </li>
      </ol>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Essay Requirements</strong>: Ensure your essay meets minimum
          or maximum word count requirements
        </li>
        <li>
          <strong>Social Media</strong>: Check character counts for Twitter/X
          posts, LinkedIn updates, or meta descriptions
        </li>
        <li>
          <strong>SEO Content</strong>: Verify article length meets SEO best
          practices (typically 1,500+ words for in-depth content)
        </li>
        <li>
          <strong>Speech Preparation</strong>: Use speaking time estimates to
          prepare presentations of the right length
        </li>
        <li>
          <strong>Writing Analysis</strong>: Identify overused words to improve
          your writing variety
        </li>
      </ul>

      <h2>Word Count Guidelines</h2>
      <p>Different content types have different ideal lengths:</p>
      <ul>
        <li>
          <strong>Twitter/X Post</strong>: 280 characters maximum
        </li>
        <li>
          <strong>Meta Description</strong>: 150-160 characters
        </li>
        <li>
          <strong>Blog Post</strong>: 1,000-2,500 words for SEO
        </li>
        <li>
          <strong>Short Story</strong>: 1,000-7,500 words
        </li>
        <li>
          <strong>Novella</strong>: 17,500-40,000 words
        </li>
        <li>
          <strong>Novel</strong>: 50,000-100,000 words
        </li>
      </ul>
    </ContentWrapper>
  );
}
