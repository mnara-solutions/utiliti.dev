import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxContent, BoxOptions, BoxTitle } from "~/components/box";
import { useEffect, useRef, useState } from "react";
import ContentWrapper from "~/components/content-wrapper";
import Copy from "~/components/copy";
import { useHydrated } from "~/hooks/use-hydrated";
import NumberInput from "~/components/number-input";
import { format, formatDistanceToNow } from "date-fns";
import { Transition } from "@headlessui/react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

export const meta = metaHelper(
  utilities.unixTimestamp.name,
  utilities.unixTimestamp.description,
);

/**
 * Extracted as a separate component to minimize re-rendering the whole route.
 *
 * @constructor
 */
function CurrentTimestamp() {
  const hydrated = useHydrated();
  const [current, setCurrent] = useState(new Date().getTime());
  const [isMilliSeconds, setIsMilliSeconds] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const interval = setInterval(() => {
      setCurrent(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [setCurrent, hydrated]);

  const currentFormatted = hydrated
    ? isMilliSeconds
      ? current
      : Math.round(current / 1000)
    : 1681653568;

  return (
    <Box>
      <BoxTitle title="Current">
        <div>
          <Copy content={currentFormatted.toString()} />
        </div>
      </BoxTitle>

      <BoxContent isLast={false} className="px-3 py-2">
        <div className="flex w-full justify-center text-4xl">
          {currentFormatted}
        </div>
        <div className="flex pt-2 w-full justify-center text-sm">
          {isMilliSeconds ? "milliseconds" : "seconds"} since 1st January, 1970
          (UTC)
        </div>
      </BoxContent>

      <BoxOptions isLast={true}>
        <div className="flex items-center h-5 w-5 ml-2">
          <input
            id="url-safe"
            type="checkbox"
            checked={isMilliSeconds}
            className="w-4 h-4 border rounded-sm focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
            onChange={(e) => setIsMilliSeconds(e.target.checked)}
          />
        </div>
        <label
          htmlFor="url-safe"
          className="ml-2 text-sm font-medium text-gray-300"
        >
          Milliseconds
        </label>
      </BoxOptions>
    </Box>
  );
}

/**
 * Table row component used for the conversion table.
 *
 * @param title
 * @param value
 * @constructor
 */
function Row({ title, value }: { title: string; value: string }) {
  return (
    <tr>
      <th scope="row" className="w-32 font-medium">
        {title}
      </th>
      <td className="text-white">{value}</td>
      <td className="flex justify-end">
        <Copy content={value} />
      </td>
    </tr>
  );
}

export default function UnixTimestamp() {
  const hydrated = useHydrated();
  const timestampRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<null | {
    action: "timestamp" | "datetime";
    value: Date;
    format: string;
  }>(null);

  const initialDate = hydrated ? new Date() : new Date("2023-04-16");

  const onInputConvert = (action: "timestamp" | "datetime") => {
    const [date, format] =
      action === "timestamp"
        ? fromTimestamp(timestampRef.current?.value || "")
        : [
            new Date(
              (dateRef.current?.valueAsNumber || 0) +
                initialDate.getTimezoneOffset() * 60 * 1000,
            ),
            "unknown",
          ];

    setInput({ action, value: date, format });
  };

  return (
    <ContentWrapper>
      <h1>Unix Timestamp</h1>

      <CurrentTimestamp />

      <Box className="mt-6">
        <BoxTitle title="Input" />
        <BoxContent isLast={true} className="px-2 py-2">
          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onInputConvert("timestamp");
            }}
          >
            <div className="w-28 text-sm">Timestamp</div>
            <div className="flex grow lg:grow-0">
              <NumberInput
                ref={timestampRef}
                name="timestamp"
                type="number"
                step="1"
                defaultValue={Math.round(initialDate.getTime() / 1000)}
                className="w-52 md:w-56"
              />
            </div>
            <div className="pl-2">
              <button
                type="submit"
                className="inline-flex justify-center p-2 rounded-sm cursor-pointer text-orange-600 hover:text-white hover:bg-orange-800"
              >
                <ArrowsRightLeftIcon className="w-5 h-5" />
                <span className="sr-only">Convert</span>
              </button>
            </div>
          </form>

          <form
            className="flex mt-2 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onInputConvert("datetime");
            }}
          >
            <div className="w-28 text-sm">Date & Time</div>
            <div className="flex grow lg:grow-0">
              <input
                ref={dateRef}
                type="datetime-local"
                step={1}
                className="w-52 md:w-56 block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500"
                defaultValue={format(initialDate, "yyyy-MM-dd HH:mm:ss")}
              />
            </div>
            <div className="pl-2">
              <button
                type="submit"
                className="inline-flex justify-center p-2 rounded-sm cursor-pointer text-orange-600 hover:text-white hover:bg-orange-800"
              >
                <ArrowsRightLeftIcon className="w-5 h-5" />
                <span className="sr-only">Convert</span>
              </button>
            </div>
          </form>
        </BoxContent>
      </Box>

      <Transition
        show={input != null}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="mt-6"
        as="div"
      >
        {input && isNaN(input.value.getDate()) ? (
          <Box>
            <BoxTitle title="Error" />
            <BoxContent isLast={true} className="px-3 py-2 text-red-400">
              Invalid date.
            </BoxContent>
          </Box>
        ) : (
          input && (
            <Box>
              <BoxTitle title="Output"></BoxTitle>
              <BoxContent isLast={true} className="px-3 py-2">
                <table className="w-full text-sm text-left text-gray-400">
                  <tbody>
                    {input.action === "timestamp" ? (
                      <Row title="Format" value={input.format} />
                    ) : (
                      <Row
                        title="Unix Timestamp"
                        value={Math.round(
                          input.value.getTime() / 1000,
                        ).toString()}
                      />
                    )}
                    <Row
                      title="UTC"
                      value={input.value.toLocaleString(undefined, {
                        timeZone: "UTC",
                      })}
                    />
                    <Row
                      title="Your Time Zone"
                      value={input.value.toLocaleString()}
                    />
                    <Row
                      title="Relative"
                      value={formatDistanceToNow(input.value, {
                        addSuffix: true,
                      })}
                    />
                  </tbody>
                </table>
              </BoxContent>
            </Box>
          )
        )}
      </Transition>

      <h2>What is a unix timestamp?</h2>
      <p>
        A Unix timestamp is a way of representing a point in time as a single
        number, which is the number of seconds that have elapsed since January
        1, 1970, at 00:00:00 UTC (Coordinated Universal Time).
      </p>

      <p>
        The Unix timestamp is widely used in computer systems and programming
        languages, especially in Unix-based operating systems such as Linux,
        macOS, and FreeBSD. It is a convenient way of representing time because
        it is a single number that can be easily stored and manipulated in
        software.
      </p>

      <p>
        The Unix timestamp is also sometimes referred to as &quot;Epoch
        time&quot; or &quot;POSIX time&quot;. It can be converted to a
        human-readable date and time using various software tools and
        programming libraries.
      </p>
    </ContentWrapper>
  );
}

function fromTimestamp(timestamp: string): [Date, string] {
  const parsed = parseInt(timestamp, 10);
  let date = parsed * 1000;
  let format = "Seconds";

  if (parsed >= 1e16 || parsed <= -1e16) {
    format = "Nanoseconds";
    date = Math.floor(parsed / 1000000);
  } else if (parsed >= 1e14 || parsed <= -1e14) {
    format = "Microseconds";
    date = Math.floor(parsed / 1000);
  } else if (parsed >= 1e11 || parsed <= -3e10) {
    format = "Milliseconds";
    date = parsed;
  }

  return [new Date(date), format];
}
