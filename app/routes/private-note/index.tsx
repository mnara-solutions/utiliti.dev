import type { MetaFunction } from "@remix-run/cloudflare";
import Button from "~/components/button";
import type { FormEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/router";
import { createId, init } from "@paralleldrive/cuid2";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Security from "~/routes/private-note/_security";
import { encrypt } from "~/utils/aes";
import Routes from "~/routes";
import Copy from "~/components/copy";

export const meta: MetaFunction = () => ({
  title: "Private Note | Utiliti",
});

type ActionData = {
  readonly error?: string;
  readonly id: string;
};

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

export const action: ActionFunction = async ({ request, context }) => {
  const privateNotesNs = context.PRIVATE_NOTES as KVNamespace;

  // grab submitted data
  const formData = await request.formData();
  const id = createId();
  const expiry = formData.get("expiry") as string;
  const ciphertext = formData.get("input") as string;
  const expiryObject = noteExpiries.find((it) => it.id === expiry);

  if (!expiryObject) {
    throw new Response("Invalid Expiry", { status: 400 });
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

  // return only the id back to the frontend
  return { id };
};

const Title = () => <h1>Private Notes</h1>;

export default function Index() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<string | null>(null);
  const [expiry, setExpiry] = useState("0");
  const submit = useSubmit();
  const actionData = useActionData<ActionData>();

  // on submit, encrypt the plaintext and then send it to the action
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
      submit(data, { method: "post", action: Routes.PRIVATE_NOTES });
    },
    [submit]
  );

  // we are intentionally not adding a <button type="submit" /> because we never want the plaintext
  // to ever be submitted (in case javascript is disabled). still using form so that we get all the remix goodies
  const onClickSubmit = useCallback(() => {
    formRef.current?.submit();
  }, []);

  // if the form was submitted, and we have action data, a note was created
  if (actionData) {
    return (
      <CreatedNote
        id={actionData.id}
        key={passwordRef.current || ""}
        expiry={expiry}
      />
    );
  }

  // render form to create note
  return (
    <>
      <Title />

      <Form ref={formRef} method="post" onSubmit={onSubmit} replace={true}>
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
              <Button type="button" label="Create" onClick={onClickSubmit} />
            </div>
          </div>
        </div>
      </Form>
      <Security />
    </>
  );
}

function CreatedNote({
  id,
  key,
  expiry,
}: {
  readonly id: string;
  readonly key: string;
  readonly expiry: string;
}) {
  const output = `${window.location.origin}${Routes.PRIVATE_NOTE(id, key)}`;

  return (
    <>
      <Title />

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

      <Security />
    </>
  );
}
