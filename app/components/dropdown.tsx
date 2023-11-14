import type { SelectHTMLAttributes } from "react";
import { classNames } from "~/common";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly options: { readonly id: string; readonly label: string }[];
  readonly onOptionChange: (value: string) => void;
}
export default function Dropdown(props: Props) {
  return (
    <select
      id={props.id}
      name={props.name}
      className={classNames(
        "block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 focus:ring-orange-500 focus:border-orange-500",
        props.className,
      )}
      defaultValue={props.defaultValue}
      onChange={(e) => props.onOptionChange(e.target.value)}
    >
      {props.options.map((it) => (
        <option key={it.id} value={it.id}>
          {it.label}
        </option>
      ))}
    </select>
  );
}
