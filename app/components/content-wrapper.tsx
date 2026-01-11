import type { PropsWithChildren } from "react";
import PopularUtilities from "~/components/popular-utilities";

export default function ContentWrapper(props: PropsWithChildren<object>) {
  return (
    <>
      {props.children}
      <PopularUtilities />
    </>
  );
}
