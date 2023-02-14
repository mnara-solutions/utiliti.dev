import type { LoaderFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import type { NoteMetadata } from "~/routes/private-note/common";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { decrypt } from "~/utils/aes";
import { copyText } from "~/utils/copy";
import {
  DocumentDuplicateIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

type LoaderData = {
  readonly note: { ciphertext: string; expiration: number } | null;
  readonly needsConfirmation?: boolean;
};

export const loader: LoaderFunction = async ({
  request,
  params,
  context,
}): Promise<LoaderData | Response> => {
  const privateNotesNs = context.PRIVATE_NOTES as KVNamespace;
  const id = params.id;

  // if there is no id present, redirect back to private notes
  if (!id) {
    return redirect("/private-note/");
  }

  const note = await privateNotesNs.getWithMetadata<NoteMetadata>(id);
  const deleteAfterRead = note.metadata?.deleteAfterRead === true;

  // if no note found, return null (todo: should make this a 404)
  if (!note.value) {
    return { note: null };
  }

  // if we found a note that should be deleted after read
  const url = new URL(request.url);
  if (deleteAfterRead) {
    if (url.searchParams.get("confirm")) {
      console.log("DELETING NOTE");
      await privateNotesNs.delete(id);
    } else {
      return { needsConfirmation: true, note: null };
    }
  }

  return {
    note: {
      ciphertext: note.value,
      expiration: deleteAfterRead ? 0 : note.metadata?.expiration || 0,
    },
  };
};

export default function PrivateNote() {
  const loaderData = useLoaderData<LoaderData>();
  const location = useLocation();
  const [plainText, setPlainText] = useState("");

  useEffect(() => {
    if (loaderData.note) {
      decrypt(loaderData.note.ciphertext, location.hash.slice(1)).then((it) =>
        setPlainText(it)
      );
    }
  }, [loaderData.note, location.hash]);

  const expiration = loaderData.note?.expiration || 0;

  if (!loaderData.note && !loaderData.needsConfirmation) {
    return (
      <>
        <h1>Private Notes</h1>

        <p className="lead">
          The note you are looking was either not found or was deleted.
        </p>

        <div className="not-prose flex flex-col items-start gap-3">
          <Link
            className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
            to="/private-note/"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 -ml-1 rotate-180"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
              ></path>
            </svg>
            Home
          </Link>
          {/*<a*/}
          {/*  className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"*/}
          {/*  href="/quickstart"*/}
          {/*>*/}
          {/*  <svg*/}
          {/*    viewBox="0 0 20 20"*/}
          {/*    fill="none"*/}
          {/*    aria-hidden="true"*/}
          {/*    className="mt-0.5 h-5 w-5 -ml-1 rotate-180"*/}
          {/*  >*/}
          {/*    <path*/}
          {/*      stroke="currentColor"*/}
          {/*      strokeLinecap="round"*/}
          {/*      strokeLinejoin="round"*/}
          {/*      d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"*/}
          {/*    ></path>*/}
          {/*  </svg>*/}
          {/*  Home*/}
          {/*</a>*/}
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Private Notes</h1>
      {loaderData.needsConfirmation ? (
        <>
          <p className="lead">
            You were sent a sensitive note which is meant to be destroyed after
            it is read. Once you click on the button below, the note will be
            deleted.
          </p>
          <div className="not-prose flex justify-end mb-16 mt-6">
            <Link
              className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
              to={`${location.pathname}?confirm=true${location.hash}`}
            >
              Show the note
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 -mr-1"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
                ></path>
              </svg>
            </Link>
          </div>
        </>
      ) : (
        <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
          <div className="flex items-center justify-end px-3 py-2 border-b border-gray-600 font-bold">
            <div>
              <button
                type="button"
                className="p-2 rounded cursor-pointer sm:ml-auto text-zinc-400 hover:text-white hover:bg-zinc-600"
                onClick={() => copyText(plainText)}
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
            <textarea
              id="output"
              rows={4}
              className="w-full px-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
              placeholder="Paste in your content..."
              readOnly={true}
              value={plainText}
            />
          </div>
          <div className="flex px-3 py-2 border-t border-gray-600 rounded-b-lg text-sm items-center">
            <InformationCircleIcon
              className="h-5 w-5 mr-1"
              aria-hidden="true"
            />
            {expiration === 0 ? (
              <span>
                This note is now deleted. Copy the content in the note before
                closing this window.
              </span>
            ) : (
              <span>
                This note will be deleted on{" "}
                {new Date(expiration * 1000).toLocaleString()}.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
