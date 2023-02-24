import Box, { BoxContent, BoxInfo, BoxTitle } from "~/components/box";
import Copy from "~/components/copy";
import { MetaFunction } from "@remix-run/cloudflare";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { useCallback, useMemo, useRef, useState } from "react";
import { throttle } from "~/utils/throttle";

export const meta: MetaFunction = () =>
  metaHelper(utilities.wordCounter.name, utilities.wordCounter.description);

interface Info {
  readonly sentences: number;
  readonly words: number;
  readonly characters: number;
  readonly all: number;
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
function decode(input: string) {
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

/**
 * Taken from https://github.com/RadLikeWhoa/Countable/blob/master/Countable.js#L149-L152.
 *
 * @param input
 */
function count(input: string): Info {
  const trimmed = input.trim();

  return {
    sentences: (trimmed.match(/[.?!…]+./g) || []).length + 1,
    words: (trimmed.replace(/['";:,.?¿\-!¡]+/g, "").match(/\S+/g) || []).length,
    characters: decode(trimmed.replace(/\s/g, "")).length,
    all: decode(input).length,
  };
}

export default function WordCounter() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [info, setInfo] = useState<Info>(count(""));

  const calculate = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    const input = inputRef.current.value;

    setInfo(count(input));
  }, []);

  const throttledCalculate = useMemo(
    () => throttle(calculate, 1000),
    [calculate]
  );

  const onChange = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    if (inputRef.current.value.length > 500000) {
      throttledCalculate();
    } else {
      calculate();
    }
  }, [calculate, throttledCalculate]);

  return (
    <>
      <h1>Word Counter</h1>

      <Box>
        <BoxTitle title="Input">
          <div>
            <Copy content={inputRef.current?.value || ""} />
          </div>
        </BoxTitle>

        <BoxContent isLast={false}>
          <textarea
            ref={inputRef}
            rows={10}
            className="w-full p-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400 break-words"
            placeholder="Start typing or paste in your text here…"
            onChange={onChange}
          ></textarea>
        </BoxContent>

        <BoxInfo>
          {info.words.toLocaleString()} words {info.all.toLocaleString()}{" "}
          characters
        </BoxInfo>
      </Box>
    </>
  );
}
