import { Outlet } from "react-router";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import ContentWrapper from "~/components/content-wrapper";

export const meta = metaHelper(
  utilities.privateNotes.name,
  utilities.privateNotes.description,
);

export default function Index() {
  return (
    <ContentWrapper>
      <h1>Private Notes</h1>

      <Outlet />

      <h2 className="mt-16">Security & Privacy</h2>
      <p>
        We aim to make private notes as secure as possible by taking the
        following steps:
      </p>

      <ul>
        <li>All data is encrypted in the browser before it is sent to us.</li>
        <li>The encryption key is never sent to us.</li>
        <li>
          Technical implementation detail and code is available on{" "}
          <a
            href="https://github.com/mnara-solutions/utiliti.dev/blob/main/private-notes.md"
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
