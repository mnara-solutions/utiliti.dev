import Button from "~/components/button";
import { useCallback, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { init } from "@paralleldrive/cuid2";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { encrypt } from "~/utils/aes";
import Routes from "~/routes";
import Copy from "~/components/copy";
import type { CreateActionData } from "~/routes/private-note/create";

export type NoteMetadata = {
  readonly deleteAfterRead: boolean;
  readonly expiration: number;
};

export const noteExpiries = [
  {
    id: "0",
    label: "after reading it",
    ttl: 30 * 24 * 60 * 60,
  },
  {
    id: "1",
    label: "1 hour from now",
    ttl: 1 * 60 * 60,
  },
  {
    id: "24",
    label: "24 hours from now",
    ttl: 24 * 60 * 60,
  },
  {
    id: "168",
    label: "7 days from now",
    ttl: 7 * 24 * 60 * 60,
  },
  {
    id: "720",
    label: "30 days from now",
    ttl: 30 * 24 * 60 * 60,
  },
];

export default function Index() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<string | null>(null);
  const [expiry, setExpiry] = useState("0");
  const fetcher = useFetcher<CreateActionData>();

  // on submit, encrypt the plaintext and then send it to the action
  const onSubmit = useCallback(async () => {
    if (!inputRef.current) {
      return;
    }

    // generate a password (shortening the length as collisions here are not important)
    const cuid = init({ length: 10 });
    passwordRef.current = cuid();

    // encrypt data
    const ciphertext = await encrypt(
      inputRef.current.value,
      passwordRef.current
    );

    // submit form
    fetcher.submit(
      {
        input: ciphertext,
        expiry,
      },
      { method: "post", action: Routes.PRIVATE_NOTE_CREATE }
    );
  }, [expiry, fetcher]);

  // if the form was submitted, and we have action data, a note was created
  if (fetcher.type === "done" && passwordRef.current) {
    return (
      <CreatedNote
        id={fetcher.data.id}
        secret={passwordRef.current}
        expiry={expiry}
      />
    );
  }

  // render form to create note
  return (
    <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
      <div className="px-4 py-2 bg-zinc-800 rounded-t-lg">
        <textarea
          id="input"
          name="input"
          ref={inputRef}
          rows={10}
          className="font-mono w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
          placeholder="Write your note here..."
          required={true}
        ></textarea>
      </div>

      <div className="flex px-5 py-2 items-center border-t border-gray-600 bg-zinc-800/50">
        <label
          htmlFor="small"
          className="block text-sm font-medium text-gray-900 dark:text-white"
        >
          Note self-destructs
        </label>
        <select
          id="expiry"
          name="expiry"
          className="block text-sm ml-2 border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500"
          defaultValue={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        >
          {noteExpiries.map((it) => (
            <option key={it.id} value={it.id}>
              {it.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end px-3 py-2 border-t border-gray-600">
        <div className="flex gap-x-2">
          <Button
            type="button"
            label="Create"
            onClick={onSubmit}
            disabled={fetcher.state === "submitting"}
          />
        </div>
      </div>
    </div>
  );
}

function CreatedNote({
  id,
  secret,
  expiry,
}: {
  readonly id: string;
  readonly secret: string;
  readonly expiry: string;
}) {
  const output = `${window.location.origin}${Routes.PRIVATE_NOTE(id, secret)}`;

  return (
    <>
      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600 font-bold">
          <div>Success</div>
          <div>
            <Copy content={output || ""} />
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-800">
          <input
            type="text"
            className="w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
            readOnly={true}
            value={output}
          />
        </div>
        <div className="flex px-3 py-2 border-t border-gray-600 rounded-b-lg text-sm items-center">
          <InformationCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          This note will self-destruct{" "}
          {noteExpiries.find((it) => it.id === expiry)?.label}.
        </div>
      </div>

      <h2>What's Next</h2>
      <p>
        You have created a private note that you can easily share with anyone
        you want with the link above.
      </p>
    </>
  );
}
