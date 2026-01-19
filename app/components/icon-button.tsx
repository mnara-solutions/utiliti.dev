import type { ComponentType, SVGProps } from "react";
import type { Placement } from "@floating-ui/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.client";

interface Props {
  readonly icon: ComponentType<SVGProps<SVGSVGElement>>;
  readonly label: string;
  readonly onClick: () => void;
  readonly tooltipPlacement?: Placement;
}

export default function IconButton({
  icon: Icon,
  label,
  onClick,
  tooltipPlacement,
}: Props) {
  return (
    <Tooltip placement={tooltipPlacement}>
      <TooltipTrigger asChild={true}>
        <button
          type="button"
          className="inline-flex justify-center p-2 rounded-sm cursor-pointer text-gray-400 hover:text-white hover:bg-zinc-600"
          onClick={onClick}
        >
          <Icon className="w-5 h-5" />
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="inline-block px-2 py-1 text-sm font-medium text-white rounded-lg shadow-xs bg-zinc-700">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
