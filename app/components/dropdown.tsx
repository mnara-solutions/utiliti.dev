import { type ChangeEvent, type SelectHTMLAttributes } from "react";
import { classNames } from "~/common";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  readonly options: { readonly id: string; readonly label: string }[];
  readonly onOptionChange: (value: string) => void;
}
export default function Dropdown({
  name,
  id,
  onOptionChange,
  options,
  className,
  defaultValue,
  value,
}: Props) {
  const onChange = (e: ChangeEvent<HTMLSelectElement>) => onOptionChange(e.target.value);

  return (
    <select
      id={id}
      name={name}
      className={classNames(
        "block text-sm border rounded-lg bg-zinc-700 border-zinc-600 placeholder-zinc-400 focus:ring-orange-500 focus:border-orange-500",
        className,
      )}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    >
      {options.map((it) => (
        <option key={it.id} value={it.id}>
          {it.label}
        </option>
      ))}
    </select>
  );
}
