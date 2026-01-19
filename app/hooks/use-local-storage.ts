import { useLayoutEffect, useState } from "react";
import { useHydrated } from "~/hooks/use-hydrated";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  json: boolean = false,
): [T, (v: T) => void] {
  const isHydrated = useHydrated();
  const [storedValue, setStoredValue] = useState(initialValue);

  // moved the loading of stored value into an effect, so that we don't have any hydration issues with react router
  useLayoutEffect(() => {
    if (typeof window === "undefined" || !isHydrated) {
      return;
    }

    try {
      const value = window.localStorage.getItem(key);

      if (value) {
        setStoredValue(json ? JSON.parse(value) : value);
      }
    } catch (error) {
      console.log("Could not read stored value", error);
    }
  }, [isHydrated, json, key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          key,
          json ? JSON.stringify(value) : (value as string),
        );
      }
    } catch (error) {
      console.log("Could not set stored value", error);
    }
  };

  return [storedValue, setValue];
}
