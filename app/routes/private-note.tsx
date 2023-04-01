import { Outlet } from "@remix-run/react";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import ContentWrapper from "~/components/content-wrapper";

export const meta = metaHelper(
  utilities.privateNotes.name,
  utilities.privateNotes.description
);

export default function Index() {
  return (
    <ContentWrapper>
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
    </ContentWrapper>
  );
}
