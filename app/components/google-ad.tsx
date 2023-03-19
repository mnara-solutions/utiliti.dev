import { useEffect } from "react";

export default function GoogleAd() {
  useEffect(() => {
    // @ts-ignore
    (adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="xl:max-w-none not-prose mt-16">
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
