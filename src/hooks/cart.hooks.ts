// ===================================================================
// CART HOOKS — Custom hooks for the Cart & Checkout system
// ===================================================================

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useCartStore } from "@/store/cart.store";
import { CART_SYNC_INTERVAL, GEOLOCATION_OPTIONS } from "@/constants/cart.constants";
import type { Coordinates } from "@/types/cart";

// ─────────────────────────────────────────────────────────────────
// useCartSync
// ─────────────────────────────────────────────────────────────────
export function useCartSync(isAuthenticated: boolean): void {

  const { lastSyncTime, cart, fetchCart } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated || !cart) return;


    const interval = setInterval(() => {
       // fetchCart();
    }, CART_SYNC_INTERVAL);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cureway_cart" && e.newValue) {
       
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated, cart, lastSyncTime, fetchCart]);
}

// ─────────────────────────────────────────────────────────────────
// useGeolocation
// ─────────────────────────────────────────────────────────────────
export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setError(null);
  }, []);

  return { coordinates, loading, error, getCurrentLocation, clearLocation };
}

// ─────────────────────────────────────────────────────────────────
// useDebounce
// ─────────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ─────────────────────────────────────────────────────────────────
// usePrevious
// ─────────────────────────────────────────────────────────────────
export function usePrevious<T>(value: T): T | undefined {
  
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// ─────────────────────────────────────────────────────────────────
// useInterval
// ─────────────────────────────────────────────────────────────────
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// ─────────────────────────────────────────────────────────────────
// useMediaQuery
// ─────────────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

// ─────────────────────────────────────────────────────────────────
// useWindowSize
// ─────────────────────────────────────────────────────────────────
export function useWindowSize() {
  const [size, setSize] = useState({
    width:  typeof window !== "undefined" ? window.innerWidth  : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

// ─────────────────────────────────────────────────────────────────
// useLocalStorage
// ─────────────────────────────────────────────────────────────────
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (err) {
        console.error("useLocalStorage setValue error:", err);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

// ─────────────────────────────────────────────────────────────────
// useClickOutside
// ─────────────────────────────────────────────────────────────────
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
): RefObject<T | null> {
  
  const ref = useRef<T>(null);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  
  return ref as unknown as RefObject<T | null>;
}

// ─────────────────────────────────────────────────────────────────
// useEscapeKey
// ─────────────────────────────────────────────────────────────────
export function useEscapeKey(callback: () => void): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
}

// ─────────────────────────────────────────────────────────────────
// useIntersectionObserver
// ─────────────────────────────────────────────────────────────────
export function useIntersectionObserver(
  ref: RefObject<Element | null>, 
  options: IntersectionObserverInit = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options,
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
}

// ─────────────────────────────────────────────────────────────────
// useFormValidation
// ─────────────────────────────────────────────────────────────────
export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  validate: (values: T) => Partial<Record<keyof T, string>>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) =>
      (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
          onSubmit(values);
        }
      },
    [values, validate],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}