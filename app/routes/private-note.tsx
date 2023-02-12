import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => ({
  title: "Private Note | Utiliti",
});

export default function PrivateNote() {
  return (
    <>
      <h1>Private Notes</h1>

      <p>Coming Soon.</p>
    </>
  );
}
