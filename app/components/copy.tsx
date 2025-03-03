import { copyText } from "~/utils/copy";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/tooltip";

interface Props {
  readonly content: string | (() => string);
}
export default function Copy({ content }: Props) {
  const text = "Copy to clipboard";
  const [tooltipText, setTooltipText] = useState(text);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    copyText(typeof content === "string" ? content : content())
      .then(() => setTooltipText("Copied"))
      .catch((e) => console.error("Could not copy to clipboard.", e));

    setTimeout(() => {
      // close the tooltip
      buttonRef.current?.blur();

      // re-set tooltip text
      setTooltipText(text);
    }, 1500);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild={true}>
        <button
          ref={buttonRef}
          type="button"
          className="p-2 rounded-sm cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-600"
          onClick={onClick}
        >
          <DocumentDuplicateIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">{text}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="inline-block px-2 py-1 text-sm font-medium text-white rounded-lg shadow-xs bg-zinc-700">
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
