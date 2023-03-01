import { Outlet } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/cloudflare";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import PopularUtilities from "~/components/popular-utilities";
import GoogleAd from "~/components/google-ad";

export const meta: MetaFunction = () =>
  metaHelper(utilities.privateNotes.name, utilities.privateNotes.description);

export default function PrivateNote() {
  return (
    <>
      <h1>Private Note</h1>

      <Outlet />

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
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </li>
      </ul>

      <PopularUtilities />

      <GoogleAd />
    </>
  );
}
