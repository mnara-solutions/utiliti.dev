import type { PropsWithChildren } from "react";
import PopularUtilities from "~/components/popular-utilities";
import GoogleAd from "~/components/google-ad";

export default function ContentWrapper(props: PropsWithChildren<{}>) {
  return (
    <>
      {props.children}
      <PopularUtilities />
      <GoogleAd />
    </>
  );
}
