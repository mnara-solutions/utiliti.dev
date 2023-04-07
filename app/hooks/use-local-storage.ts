import { useState } from "react";

export function useLocalStorage(
  key: string,
  initialValue: string
): [string, (v: string) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      return window.localStorage.getItem(key) || initialValue;
    } catch (error) {
      console.log(error);

      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
