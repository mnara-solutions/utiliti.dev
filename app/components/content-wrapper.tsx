import type { ReactNode } from "react";
import PopularUtilities from "~/components/popular-utilities";

interface Props {
  readonly children: ReactNode;
}

export default function ContentWrapper({ children }: Props) {
  return (
    <>
      {children}
      <PopularUtilities />
    </>
  );
}
