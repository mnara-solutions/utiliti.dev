import type { MetaFunction } from "@remix-run/cloudflare";
import Button from "~/components/button";
import type { FormEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/router";
import { encrypt } from "./aes";
import { createId, init } from "@paralleldrive/cuid2";
import { noteExpiries } from "~/routes/private-note/common";
import { copyText } from "~/utils/copy";
import {
  DocumentDuplicateIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export const meta: MetaFunction = () => ({
  title: "Private Note | Utiliti",
});

type ActionData = {
  readonly error?: string;
  readonly id?: string;
};

export const action: ActionFunction = async ({ request, context }) => {
  const privateNotesNs = context.PRIVATE_NOTES as KVNamespace;

  const formData = await request.formData();
  const id = createId();
  const expiry = formData.get("expiry") as string;
  const ciphertext = formData.get("input") as string;
  const expiryObject = noteExpiries.find((it) => it.id === expiry);

  if (!expiryObject) {
    return { error: "Invalid expiry." };
  }

  // store ciphertext in kv store
  const expiration = Math.floor(Date.now() / 1000) + expiryObject.ttl;
  await privateNotesNs.put(id, ciphertext, {
    expiration,
    metadata: {
      deleteAfterRead: expiryObject.id === "0",
      expiration,
    },
  });

  return { id };
};

export default function Index() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<string | null>(null);
  const [expiry, setExpiry] = useState("0");
  const submit = useSubmit();
  const actionData = useActionData<ActionData>();
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      if (!inputRef.current) {
        return;
      }

      // stop form submission
      e.preventDefault();

      // generate a password (shortening the length as collisions here are not important)
      const cuid = init({ length: 10 });
      passwordRef.current = cuid();

      // encrypt data
      const form = e.currentTarget;
      const data = new FormData(form);

      data.set(
        "input",
        await encrypt(inputRef.current.value, passwordRef.current)
      );

      // submit form
      submit(data, { method: "post", action: "/private-note/" });
    },
    [submit]
  );

  const created = actionData?.id;

  if (created) {
    const output = `${window.location.origin}/private-note/${created}#${passwordRef.current}`;
    return (
      <>
        <h1>Private Notes</h1>
        <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600 font-bold">
            <div>Success</div>
            <div>
              <button
                type="button"
                className="p-2 rounded cursor-pointer sm:ml-auto text-zinc-400 hover:text-white hover:bg-zinc-600"
                onClick={() => copyText(output || "")}
              >
                <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Copy to clipboard</span>
              </button>
            </div>
          </div>
          <div className="px-4 py-2 bg-zinc-800">
            <label htmlFor="input" className="sr-only">
              Your output
            </label>
            <input
              type="text"
              className="w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
              readOnly={true}
              value={output || ""}
            />
          </div>
          <div className="flex px-3 py-2 border-t border-gray-600 rounded-b-lg text-sm items-center">
            <InformationCircleIcon
              className="h-5 w-5 mr-1"
              aria-hidden="true"
            />
            This note will self-destruct{" "}
            {noteExpiries.find((it) => it.id === expiry)?.label}.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Private Notes</h1>

      <Form method="post" onSubmit={onSubmit}>
        <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
          <div className="px-4 py-2 bg-zinc-800 rounded-t-lg">
            <label htmlFor="input" className="sr-only">
              Your input
            </label>
            <textarea
              id="input"
              name="input"
              ref={inputRef}
              rows={4}
              className="w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
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
              <Button type="submit" label="Create" />
            </div>
          </div>
        </div>
      </Form>
      <h2>Security & Privacy</h2>
      <p>
        We aim to make private notes as secure as possible by taking the
        following steps:
      </p>
      <ul>
        <li>All data is encrypted in the browser before it is sent to us.</li>
        <li>The encryption key is never sent to us.</li>
        <li>
          All the code is available on{" "}
          <a
            href="https://github.com/mnara-solutions/utiliti.dev/tree/main/app/routes/private-note"
            target="_blank"
          >
            GitHub
          </a>
          .
        </li>
      </ul>
    </>
  );
}
