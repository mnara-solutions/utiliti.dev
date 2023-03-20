import { useEffect, useRef } from "react";
import { ClientOnly } from "~/components/client-only";

export default function WrappedGoogleAd() {
  return <ClientOnly>{() => <GoogleAd />}</ClientOnly>;
}

function GoogleAd() {
  const adsLoaded = useRef(false);
  useEffect(() => {
    if (adsLoaded.current) {
      return;
    }

    const scriptTag = document.createElement("script");
    scriptTag.setAttribute(
      "src",
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9826263890932106"
    );
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("async", "async");
    scriptTag.setAttribute("crossorigin", "anonymous");
    document.body.appendChild(scriptTag);

    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});

    adsLoaded.current = true;
  }, []);

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
