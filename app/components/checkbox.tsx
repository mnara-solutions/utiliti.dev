import type { ChangeEventHandler } from "react";

export default function Checkbox({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <div className="flex items-center">
        <input
          id={id}
          onChange={onChange}
          checked={value}
          type="checkbox"
          className="w-4 h-4 border rounded-sm focus:ring-3 bg-zinc-700 border-zinc-600 focus:ring-orange-600 ring-offset-zinc-800 focus:ring-offset-zinc-800 text-orange-600"
        />

        <label htmlFor={id} className="ml-2 text-sm font-medium text-white">
          {label}
        </label>
      </div>
    </div>
  );
}
