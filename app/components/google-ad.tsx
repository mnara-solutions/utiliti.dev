import { ClientOnly } from "~/components/client-only";

export default function WrappedGoogleAd() {
  return <ClientOnly>{() => <GoogleAd />}</ClientOnly>;
}

function GoogleAd() {
  return (
    <div className="xl:max-w-none not-prose mt-16">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-9826263890932106"
        data-ad-slot="5018769606"
      ></ins>
    </div>
  );
}
