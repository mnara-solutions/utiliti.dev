import type { LoaderFunction } from "@remix-run/router";
import { redirect } from "@remix-run/router";
import type { NoteMetadata } from "~/routes/private-note/index";
import type { Location } from "@remix-run/react";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Security from "~/routes/private-note/_security";
import type { MetaFunction } from "@remix-run/cloudflare";
import {
  ArrowSmallLeftIcon,
  ArrowSmallRightIcon,
} from "@heroicons/react/24/solid";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import Copy from "~/components/copy";
import { decrypt } from "~/utils/aes";
import Routes from "~/routes";

type LoaderData = {
  readonly ciphertext: string;
  readonly expiration: number;
  readonly needsConfirmation: boolean;
};

export const meta: MetaFunction = () => ({
  title: "Private Note | Utiliti",
});

export const loader: LoaderFunction = async ({
  request,
  params,
  context,
}): Promise<LoaderData | Response> => {
  const privateNotesNs = context.PRIVATE_NOTES as KVNamespace;
  const id = params.id;

  // if there is no id present, redirect back to private notes (technically not possible)
  if (!id) {
    return redirect(Routes.PRIVATE_NOTES);
  }

  const note = await privateNotesNs.getWithMetadata<NoteMetadata>(id);
  const deleteAfterRead = note.metadata?.deleteAfterRead === true;

  // if no note was found, stop
  if (!note.value) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  // if we found a note that should be deleted after read
  if (deleteAfterRead) {
    if (new URL(request.url).searchParams.get("confirm")) {
      await privateNotesNs.delete(id);
    } else {
      return {
        ciphertext: "",
        expiration: note?.metadata?.expiration || 0,
        needsConfirmation: true,
      };
    }
  }

  // return ciphertext to the frontend
  return {
    ciphertext: note.value,
    needsConfirmation: false,
    expiration: note?.metadata?.expiration || 0,
  };
};

export default function PrivateNote() {
  const loaderData = useLoaderData<LoaderData>();
  const location = useLocation();

  const [plainText, setPlainText] = useState<string | null>(null);
  const [decryptionError, setDecryptionError] = useState(false);

  useEffect(() => {
    if (!loaderData.ciphertext) {
      return;
    }

    decrypt(loaderData.ciphertext, location.hash.slice(1))
      .then((it) => setPlainText(it))
      .catch((it) => {
        console.error(
          "Error occurred while trying to decrypt the ciphertext.",
          it
        );
        setDecryptionError(true);
      });
  }, [loaderData.ciphertext, location.hash]);

  const expiration = loaderData.expiration;

  // if this note is supposed to be deleted after it's shown, show a confirmation
  // this also makes it so that tools that inspect URLs do not inadvertently read the node.
  if (loaderData.needsConfirmation) {
    return (
      <>
        <Title />
        <Confirm location={location} />
        <Security />
      </>
    );
  }

  // if we ran into a decryption error, show an error page
  if (decryptionError || plainText === null) {
    return (
      <Error message="An error occurred while trying to decrypt the note. Double check that the URL is copied exactly and try again." />
    );
  }

  // finally, show the note
  return (
    <>
      <Title />

      <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
        <div className="flex items-center justify-end px-3 py-2 border-b border-gray-600 font-bold">
          <div>
            <Copy content={plainText} />
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-800">
          <ReadOnlyTextArea value={plainText} />
        </div>
        <div className="flex px-3 py-2 border-t border-gray-600 rounded-b-lg text-sm items-center">
          <InformationCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
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
      <Security />
    </>
  );
}

function Title() {
  return <h1>Private Notes</h1>;
}

function Confirm({ location }: { readonly location: Location }) {
  return (
    <>
      <p className="lead">
        You were sent a sensitive note which is meant to be destroyed after it
        is read. Once you click on the button below, the note will be deleted.
      </p>
      <div className="not-prose my-6">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to={`${location.pathname}?confirm=true${location.hash}`}
        >
          Show the note
          <ArrowSmallRightIcon className="h-4 w-4 -mr-1" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

function Error({ message }: { readonly message: string }) {
  return (
    <>
      <Title />

      <p className="lead">{message}</p>

      <div className="not-prose flex flex-col items-start gap-3">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to={Routes.PRIVATE_NOTES}
        >
          <ArrowSmallLeftIcon className="h-4 w-4 -ml-1" aria-hidden="true" />
          Back
        </Link>
      </div>
    </>
  );
}

// nested catch boundary to catch the 404 thrown in the loader
export function CatchBoundary() {
  return (
    <Error message="The note you are looking was either not found or was deleted." />
  );
}
