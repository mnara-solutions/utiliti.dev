import { useCallback, useState, type DragEvent, type RefCallback } from "react";

interface UseFileDropOptions {
  onDrop: (files: File[]) => void;
  accept?: string;
}

interface UseFileDropResult {
  ref: RefCallback<HTMLElement>;
  isOver: boolean;
}

export function useFileDrop({
  onDrop,
  accept,
}: UseFileDropOptions): UseFileDropResult {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set isOver to false if we're leaving the drop zone entirely
    // (not just entering a child element)
    const relatedTarget = e.relatedTarget as Node | null;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOver(false);

      const files = Array.from(e.dataTransfer.files);

      if (accept && files.length > 0) {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const filteredFiles = files.filter((file) =>
          acceptedTypes.some((type) => {
            if (type.endsWith("/*")) {
              // Handle wildcards like "image/*"
              const baseType = type.slice(0, -2);
              return file.type.startsWith(baseType);
            }
            return file.type === type;
          }),
        );
        onDrop(filteredFiles);
      } else {
        onDrop(files);
      }
    },
    [accept, onDrop],
  );

  const ref: RefCallback<HTMLElement> = useCallback(
    (element: HTMLElement | null) => {
      if (element) {
        element.ondragover = handleDragOver as unknown as (
          e: globalThis.DragEvent,
        ) => void;
        element.ondragenter = handleDragEnter as unknown as (
          e: globalThis.DragEvent,
        ) => void;
        element.ondragleave = handleDragLeave as unknown as (
          e: globalThis.DragEvent,
        ) => void;
        element.ondrop = handleDrop as unknown as (
          e: globalThis.DragEvent,
        ) => void;
      }
    },
    [handleDragOver, handleDragEnter, handleDragLeave, handleDrop],
  );

  return { ref, isOver };
}
