import { type ReactNode } from "react";
import { cn } from "~/common";

interface Props {
  readonly show: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function FadeIn({ show, children, className }: Props) {
  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        "transition-opacity duration-300 ease-out starting:opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
