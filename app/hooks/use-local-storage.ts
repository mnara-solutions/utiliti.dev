import { useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  json: boolean = false,
): [T, (v: T) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const value = window.localStorage.getItem(key);

      if (!value) {
        return initialValue;
      }

      return json ? JSON.parse(value) : value;
    } catch (error) {
      console.log(error);

      return initialValue;
    }
  });

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
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
