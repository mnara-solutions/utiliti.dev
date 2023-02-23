import type { PropsWithChildren, ReactNode } from "react";

interface Props {
  readonly renderTitle: () => ReactNode;
}
export default function OutputBox({
  renderTitle,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="w-full mb-4 border rounded-lg bg-zinc-700 border-zinc-600">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
        {renderTitle()}
      </div>
      <div className="px-4 py-2 bg-zinc-800 rounded-b-lg not-prose">
        {children}
      </div>
    </div>
  );
}
