import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { classNames } from "~/common";

export default forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function NumberInput({ className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      type="number"
      className={classNames(
        "block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 text-white focus:ring-orange-500 focus:border-orange-500",
        className,
      )}
      {...rest}
    />
  );
});
