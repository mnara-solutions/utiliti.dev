export function debounce<T extends unknown[], U>(
  func: (...args: T) => U,
  delayMs: number = 300,
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function (...args: T) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      func(...args);
    }, delayMs);
  };
}
