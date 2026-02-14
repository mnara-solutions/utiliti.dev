import { useRef, useState } from "react";
import { format, formatInTimeZone } from "date-fns-tz";

import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import ContentWrapper from "~/components/content-wrapper";
import Copy from "~/components/copy";
import { useHydrated } from "~/hooks/use-hydrated";
import Dropdown from "~/components/dropdown";

export const meta = metaHelper(utilities.timezoneConverter);

const timeZones = Intl.supportedValuesOf("timeZone").sort();
const formatString = "yyyy/MM/dd hh:mm:ss a";

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

  const [input, setInput] = useState<Date>(new Date());

  const initialDate = hydrated ? new Date() : new Date("2026-01-01T00:00:00Z");
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [targetZone, setTargetZone] = useState<string>(
    hydrated ? systemTimeZone : "America/Vancouver",
  );

  const onDateChange = () => {
    const value = dateRef.current?.value;
    if (!value) {
      setInput(new Date());
      return;
    }

    const m = new Date(value + "Z");
    setInput(m);
  };

  return (
    <ContentWrapper>
      <h1>Time Zone Converter</h1>

      <Box className="mt-6">
        <BoxTitle title="Input" />
        <BoxContent isLast={true} className="px-2 py-2">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center md:w-1/2">
              <div className="w-28 text-sm">Date &amp; Time</div>
              <div className="flex grow lg:grow-0">
                <input
                  ref={dateRef}
                  type="datetime-local"
                  step={1}
                  className="w-52 md:w-56 block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500"
                  defaultValue={format(initialDate, "yyyy-MM-dd'T'HH:mm:ss")}
                  onChange={onDateChange}
                />
              </div>
            </div>

            <div className="flex items-center md:w-1/2">
              <div className="w-28 text-sm">Target Time Zone</div>
              <div className="flex grow lg:grow-0">
                <Dropdown
                  value={targetZone}
                  onChange={(event) => setTargetZone(event.target.value)}
                  onOptionChange={(value) => setTargetZone(value)}
                  options={timeZones.map((tz) => ({ id: tz, label: tz }))}
                />
              </div>
            </div>
          </div>
        </BoxContent>
      </Box>

      <Box className="mt-6">
        <BoxTitle title="Output" />
        <BoxContent isLast={true} className="px-3 py-2">
          <table className="w-full text-sm text-left text-gray-400">
            <tbody>
              <Row
                title="UTC"
                value={formatInTimeZone(input, "UTC", formatString)}
              />
              <Row
                title={systemTimeZone}
                value={formatInTimeZone(input, systemTimeZone, formatString)}
              />
              <Row
                title={targetZone}
                value={formatInTimeZone(input, targetZone, formatString)}
              />
            </tbody>
          </table>
        </BoxContent>
      </Box>

      <h2>Why Use Utiliti&apos;s Timezone Converter?</h2>
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
          <code>date-fns-tz</code> library to ensure precise results.
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
