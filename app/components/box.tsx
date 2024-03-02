import type { PropsWithChildren } from "react";
import { classNames } from "~/common";

export default function Box({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={classNames(
        "w-full border rounded-lg bg-zinc-700 border-zinc-600",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BoxTitle({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="px-3 py-2 flex items-center justify-between border-b border-gray-600">
      <div className="font-bold">{title}</div>
      {children}
    </div>
  );
}

export function BoxContent({
  children,
  isLast = true,
  className,
}: PropsWithChildren<{
  readonly isLast: boolean;
  readonly className?: string | undefined;
}>) {
  return (
    <div
      className={classNames(
        "bg-zinc-800 max-h-96 overflow-auto not-prose",
        isLast && "rounded-b-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BoxButtons({
  children,
  className,
}: PropsWithChildren<{ readonly className?: string | undefined }>) {
  return (
    <div
      className={classNames(
        "px-3 py-2 flex items-center justify-between border-t border-gray-600",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BoxOptions({
  isLast,
  children,
  className,
}: PropsWithChildren<{
  readonly isLast: boolean;
  readonly className?: string | undefined;
}>) {
  return (
    <div
      className={classNames(
        "px-3 py-2 flex border-t border-gray-600 bg-zinc-800/50 items-center",
        isLast && "rounded-b-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BoxInfo({ children }: PropsWithChildren<object>) {
  return (
    <div className="px-3 py-2 flex border-t border-gray-600 rounded-b-lg text-sm items-center">
      {children}
    </div>
  );
}
