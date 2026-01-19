import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "~/common";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export default function NumberInput({ className, ref, ...rest }: Props) {
  return (
    <input
      ref={ref}
      type="number"
      className={cn(
        "block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 focus:ring-orange-500 focus:border-orange-500",
        className,
      )}
      {...rest}
    />
  );
}
