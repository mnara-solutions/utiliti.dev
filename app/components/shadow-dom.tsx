import { useEffect, useRef } from "react";

export default function ShadowDom({ content }: { readonly content: string }) {
  const shadowRef = useRef<HTMLDivElement>(null);

  // effect to create the shadow dom node
  useEffect(() => {
    if (!shadowRef.current || shadowRef?.current?.shadowRoot) {
      return;
    }

    shadowRef.current.attachShadow({ mode: "open" });
  }, []);

  // effect to keep the contents updated
  useEffect(() => {
    if (!shadowRef.current?.shadowRoot) {
      return;
    }
    shadowRef.current.shadowRoot.innerHTML = content;
  }, [content]);

  return <div ref={shadowRef}></div>;
}
