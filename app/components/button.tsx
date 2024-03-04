import type { ButtonHTMLAttributes } from "react";
import { classNames } from "~/common";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly label: string;
  readonly className?: string;
}

export default function Button(props: Props) {
  const { label, className, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={classNames(
        "inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-orange-600 rounded-lg hover:bg-orange-800",
        className,
      )}
    >
      {label}
    </button>
  );
}
