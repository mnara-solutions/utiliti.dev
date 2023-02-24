export function throttle<T extends unknown[], U>(
  func: (...args: T) => U,
  throttleMilliseconds = 50
): (this: unknown, ...args: T) => void {
  let timeoutId: number | undefined;

  return function (this: unknown, ...args: T) {
    if (timeoutId === undefined) {
      timeoutId = window.setTimeout(() => {
        timeoutId = undefined;
      }, throttleMilliseconds);
      func.apply(this, args);
    }
  };
}
