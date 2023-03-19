import { useEffect } from "react";
import { ClientOnly } from "~/components/client-only";

export default function WrappedGoogleAd() {
  return <ClientOnly>{() => <GoogleAd />}</ClientOnly>;
}

function GoogleAd() {
  useEffect(() => {
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="xl:max-w-none not-prose mt-16">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7171176134175232"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7171176134175232"
        data-ad-slot="5476284816"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
