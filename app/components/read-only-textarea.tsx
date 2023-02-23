import { useEffect, useRef } from "react";

interface Props {
  readonly value: string;
}
export default function ReadOnlyTextArea({ value }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      className="font-mono w-full p-0 text-sm border-0 bg-zinc-800 focus:ring-0 text-white placeholder-zinc-400"
      readOnly={true}
      value={value}
    />
  );
}
