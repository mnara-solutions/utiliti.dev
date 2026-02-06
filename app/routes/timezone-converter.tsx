import { useRef, useState } from "react";
import { format } from "date-fns";
import moment from "moment-timezone";
import type { Moment } from "moment-timezone";

import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";

import Box, { BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import Copy from "~/components/copy";
import { useHydrated } from "~/hooks/use-hydrated";
import FadeIn from "~/components/fade-in";

export const meta = metaHelper(utilities.timezoneConverter);

const timeZones = moment.tz.names();

function Row({ title, value }: { title: string; value: string }) {
  return (
    <tr>
      <th scope="row" className="w-32 font-medium text-white text-left pr-4">
        {title}
      </th>
      <td className="text-white">{value}</td>
      <td className="flex justify-end">
        <Copy content={value} />
      </td>
    </tr>
  );
}

export default function TimezoneConverter() {
  const hydrated = useHydrated();
  const dateRef = useRef<HTMLInputElement>(null);
  const [targetZone, setTargetZone] = useState<string>("UTC");
  const [input, setInput] = useState<Moment | null>(null);

  const initialDate = hydrated ? new Date() : new Date("2023-04-16");
  const systemTimeZone = moment.tz.guess() || "UTC";

  const onConvert = () => {
    const value = dateRef.current?.value;
    if (!value) {
      setInput(null);
      return;
    }

    const m = moment.tz(value, systemTimeZone);
    if (!m.isValid()) {
      setInput(null);
      return;
    }

    setInput(m);
  };

  return (
    <ContentWrapper>
      <h1>Time Zone Converter</h1>

      <Box className="mt-6">
        <BoxTitle title="Input" />
        <BoxContent isLast={true} className="px-2 py-2">
          <form
            className="flex flex-col gap-2 md:flex-row md:items-center"
            onSubmit={(e) => {
              e.preventDefault();
              onConvert();
            }}
          >
            <div className="flex items-center md:w-1/2">
              <div className="w-28 text-sm">Date &amp; Time</div>
              <div className="flex grow lg:grow-0">
                <input
                  ref={dateRef}
                  type="datetime-local"
                  step={1}
                  className="w-52 md:w-56 block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500"
                  defaultValue={format(initialDate, "yyyy-MM-dd'T'HH:mm:ss")}
                />
              </div>
            </div>

            <div className="flex items-center md:w-1/2">
              <div className="w-28 text-sm">Target Time Zone</div>
              <select
                className="w-52 md:w-56 block text-sm border rounded-lg bg-zinc-700 border-zinc-600 text-white focus:ring-orange-500 focus:border-orange-500"
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
              >
                {timeZones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:pl-2">
              <button
                type="submit"
                className="inline-flex justify-center px-3 py-2 rounded-sm cursor-pointer text-orange-600 hover:text-white hover:bg-orange-800"
              >
                Convert
              </button>
            </div>
          </form>
        </BoxContent>
      </Box>

      <FadeIn show={input != null} className="mt-6">
        {!input ? null : !input.isValid() ? (
          <Box>
            <BoxTitle title="Error" />
            <BoxContent isLast={true} className="px-3 py-2 text-red-400">
              Invalid date.
            </BoxContent>
          </Box>
        ) : (
          <Box>
            <BoxTitle title="Output" />
            <BoxContent isLast={true} className="px-3 py-2">
              <table className="w-full text-sm text-left text-gray-400">
                <tbody>
                  <Row
                    title="UTC"
                    value={input
                      .clone()
                      .tz("UTC")
                      .format("YYYY-MM-DD HH:mm:ss z")}
                  />
                  <Row
                    title={systemTimeZone}
                    value={input
                      .clone()
                      .tz(systemTimeZone)
                      .format("YYYY-MM-DD HH:mm:ss z")}
                  />
                  <Row
                    title={targetZone}
                    value={input
                      .clone()
                      .tz(targetZone)
                      .format("YYYY-MM-DD HH:mm:ss z")}
                  />
                </tbody>
              </table>
            </BoxContent>
          </Box>
        )}
      </FadeIn>

      <h2>Why Use Utiliti&apos;s Unix Timezone Converter?</h2>
      <p>
        Utiliti&apos;s Time Zone Converter offers a quick, easy, and private way
        to convert date and time values between different time zones. Whether
        you&apos;re scheduling meetings across time zones, coordinating events,
        or simply need to know the local time in another region, this tool has
        you covered.
      </p>

      <h2>How to Use</h2>
      <ol>
        <li>
          Select a date and time in your local time zone using the datetime
          picker.
        </li>
        <li>Choose a target time zone from the dropdown.</li>
        <li>Click Convert to see the equivalent time in each time zone.</li>
        <li>
          Use the copy buttons to copy any of the formatted date/time values.
        </li>
      </ol>

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Wide Time Zone Support:</strong> Convert between all major
          time zones worldwide.
        </li>
        <li>
          <strong>User-Friendly Interface:</strong> Simple and intuitive design
          for quick conversions.
        </li>
        <li>
          <strong>Accurate Conversions:</strong> Powered by the reliable
          <code>moment-timezone</code> library to ensure precise results.
        </li>
        <li>
          <strong>Quick UTC:</strong> Instantly see the UTC equivalent of your
          local time input.
        </li>
      </ul>

      <h2>Who Can Benefit from the Time Zone Converter?</h2>
      <p>
        Professionals coordinating meetings across different time zones,
        travelers planning their itineraries, remote teams collaborating
        globally, event organizers scheduling activities, and anyone needing to
        quickly convert date and time values between time zones.
      </p>
    </ContentWrapper>
  );
}
