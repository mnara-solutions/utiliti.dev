import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";
import type { NoteMetadata } from "~/routes/private-note/index";
import {
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useLocation,
  useRouteError,
} from "react-router";
import { useEffect, useState, useLayoutEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import ReadOnlyTextArea from "~/components/read-only-textarea";
import Copy from "~/components/copy";
import { decrypt } from "~/utils/aes";
import { Routes } from "~/routes";
import Box, { BoxContent, BoxInfo, BoxTitle } from "~/components/box";
import { useHydrated } from "~/hooks/use-hydrated";

type LoaderData = {
  readonly ciphertext: string;
  readonly expiration: number;
  readonly needsConfirmation: boolean;
};

export const loader: LoaderFunction = async ({
  request,
  params,
  context,
}): Promise<LoaderData | Response> => {
  const privateNotesNs: KVNamespace = context.cloudflare.env.PRIVATE_NOTES;
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
    expiration: deleteAfterRead ? 0 : note?.metadata?.expiration || 0,
  };
};

export default function PrivateNote() {
  const loaderData = useLoaderData<LoaderData>();
  const location = useLocation();
  const hydrated = useHydrated();

  const [plainText, setPlainText] = useState<null | string>(null);
  const [decryptionError, setDecryptionError] = useState(false);

  // We are going to capture the `key` on load, and then remove it from the URL. This is to prevent
  // the key from leaking via browser history. More details: https://github.com/mnara-solutions/utiliti.dev/issues/12
  // This only works because react router will fetch the note when the confirm button is clicked without reloading
  // the document (only if javascript is enabled, which is kind of necessary for this website).
  const [key] = useState(location.hash.slice(1));
  useEffect(() => {
    if (location.hash.length > 0) {
      history.replaceState(
        {},
        document.title,
        Routes.PRIVATE_NOTES + "#redacted",
      );
    }
  }, [location]);

  useLayoutEffect(() => {
    if (!loaderData.ciphertext) {
      return;
    }

    decrypt(loaderData.ciphertext, key)
      .then((it) => setPlainText(it))
      .catch((it) => {
        console.error(
          "Error occurred while trying to decrypt the ciphertext.",
          it,
        );

        setDecryptionError(true);
      });
  }, [loaderData.ciphertext, key]);

  const expiration = loaderData.expiration;

  // if we ran into a decryption error, show an error page
  if (decryptionError || (hydrated && key.length !== 10)) {
    return (
      <Error message="An error occurred while trying to decrypt the note. Double check that the URL is copied exactly and try again." />
    );
  }

  // if this note is supposed to be deleted after it's shown, show a confirmation
  // this also makes it so that tools that inspect URLs do not inadvertently read the node.
  if (loaderData.needsConfirmation) {
    return <Confirm />;
  }

  // finally, show the note
  return (
    <Box>
      <BoxTitle title="">
        <div>
          <Copy content={plainText || ""} />
        </div>
      </BoxTitle>
      <BoxContent isLast={false}>
        {plainText === null ? (
          <ReadOnlyTextArea value="Decrypting…" />
        ) : (
          <ReadOnlyTextArea value={plainText} />
        )}
      </BoxContent>
      <BoxInfo>
        <InformationCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
        {plainText !== null &&
          (expiration === 0 ? (
            <span>
              This note is now deleted. Copy the content in the note before
              closing this window.
            </span>
          ) : (
            <span>
              This note will be deleted on{" "}
              {new Date(expiration * 1000).toLocaleString()}.
            </span>
          ))}
      </BoxInfo>
    </Box>
  );
}

function Confirm() {
  return (
    <>
      <p className="lead">
        You were sent a sensitive note which is meant to be destroyed after it
        is read. Once you click on the button below, the note will be deleted.
      </p>
      <div className="not-prose my-6">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to={`?confirm=true`}
          viewTransition={true}
        >
          Show the note
          <ArrowRightIcon className="h-4 w-4 -mr-1" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

function Error({ message }: { readonly message: string }) {
  return (
    <>
      <p className="lead">{message}</p>

      <div className="not-prose flex flex-col items-start gap-3">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to={Routes.PRIVATE_NOTES}
          viewTransition={true}
        >
          <ArrowLeftIcon className="h-4 w-4 -ml-1" aria-hidden="true" />
          Back
        </Link>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const routeError = useRouteError();

  if (isRouteErrorResponse(routeError)) {
    return (
      <Error message="The note you are looking was either not found or was deleted." />
    );
  }

  return <Error message="Oops! Something bad happened." />;
}
