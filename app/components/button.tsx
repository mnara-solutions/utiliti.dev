import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly label: string;
}

export default function Button(props: Props) {
  const { label, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-orange-600 rounded-lg hover:bg-orange-800"
    >
      {props.label}
    </button>
  );
}
