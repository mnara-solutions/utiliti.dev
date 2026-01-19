import { Outlet } from "react-router";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import ContentWrapper from "~/components/content-wrapper";

export const meta = metaHelper(utilities.privateNotes);

export default function Index() {
  return (
    <ContentWrapper>
      <h1>Private Notes</h1>

      <Outlet />

      <h2 className="mt-16">What is a Private Note?</h2>
      <p>
        A private note is a secure, self-destructing message that you can share
        with anyone via a unique link. Once the recipient reads the note, it is
        permanently deleted from our servers. This makes private notes ideal for
        sharing sensitive information like passwords, API keys, credit card
        numbers, or any confidential text that you don&apos;t want lingering in
        email threads or chat logs.
      </p>
      <p>
        Unlike regular messaging apps or email, private notes leave no trace
        after being read. The recipient gets one chance to view the content, and
        then it&apos;s gone forever—providing peace of mind when sharing
        sensitive data.
      </p>

      <h2>Why Use Utiliti&apos;s Private Notes?</h2>
      <p>
        Most &quot;secure note&quot; services encrypt your data on their
        servers, which means they technically have access to your information.
        Utiliti takes a fundamentally different approach:{" "}
        <strong>
          your note is encrypted in your browser before it ever leaves your
          device
        </strong>
        . We never see your plaintext data—not even for a millisecond.
      </p>

      <h3>Key Security Features</h3>
      <ul>
        <li>
          <strong>Client-Side Encryption</strong>: Your note is encrypted using
          AES-GCM 256-bit encryption directly in your browser. The plaintext
          never touches our servers.
        </li>
        <li>
          <strong>Zero-Knowledge Architecture</strong>: The encryption key is
          stored in the URL fragment (after the #), which is never sent to our
          servers. We literally cannot decrypt your notes.
        </li>
        <li>
          <strong>Self-Destructing</strong>: Notes are automatically deleted
          after being read, or after your chosen expiration time—whichever comes
          first.
        </li>
        <li>
          <strong>No Account Required</strong>: Create and share notes instantly
          without signing up or providing any personal information.
        </li>
        <li>
          <strong>Open Source</strong>: Our entire codebase is{" "}
          <a
            href="https://github.com/mnara-solutions/utiliti.dev"
            target="_blank"
            rel="noreferrer"
          >
            open source on GitHub
          </a>
          . Don&apos;t trust us? Audit the code yourself.
        </li>
      </ul>

      <h2>How to Use Private Notes</h2>
      <ol>
        <li>
          <strong>Write your note</strong>: Type or paste your sensitive
          information in the text box above.
        </li>
        <li>
          <strong>Set expiration</strong>: Choose when the note should
          self-destruct—immediately after reading, or after a set time period.
        </li>
        <li>
          <strong>Create & share</strong>: Click &quot;Create&quot; to generate
          a unique link. Share this link with your recipient through any channel
          (email, Slack, SMS, etc.).
        </li>
        <li>
          <strong>Recipient views once</strong>: When the recipient opens the
          link, they&apos;ll see the decrypted note. After viewing (or after
          expiration), the note is permanently deleted.
        </li>
      </ol>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Sharing passwords</strong>: Send login credentials to a
          colleague without leaving them in your email history.
        </li>
        <li>
          <strong>API keys & tokens</strong>: Securely transmit sensitive
          development credentials to team members.
        </li>
        <li>
          <strong>Personal information</strong>: Share SSNs, credit card
          numbers, or other PII that shouldn&apos;t persist in chat logs.
        </li>
        <li>
          <strong>Confidential messages</strong>: Send any text that you want to
          disappear after being read.
        </li>
      </ul>

      <h2>Technical Implementation</h2>
      <p>
        We believe in transparency. Our encryption implementation uses the Web
        Crypto API with AES-GCM (256-bit keys). The encryption key is generated
        client-side and appended to the URL as a fragment identifier, ensuring
        it never reaches our servers. For a detailed technical breakdown, see
        our{" "}
        <a
          href="https://github.com/mnara-solutions/utiliti.dev/blob/main/private-notes.md"
          target="_blank"
          rel="noreferrer"
        >
          security documentation on GitHub
        </a>
        .
      </p>

      <h2>Privacy-First Alternative to Privnote</h2>
      <p>
        If you&apos;re looking for a Privnote alternative that prioritizes your
        privacy, Utiliti&apos;s Private Notes offers true end-to-end encryption
        where only you and your recipient can ever read the message. Combined
        with our open-source codebase and zero-knowledge architecture, you can
        trust that your sensitive information stays private.
      </p>
    </ContentWrapper>
  );
}
