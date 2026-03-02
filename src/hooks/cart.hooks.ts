"use client";

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { useCartStore } from "@/store/cart.store";
import { CART_SYNC_INTERVAL, GEOLOCATION_OPTIONS } from "@/constants/cart.constants";
import type { Coordinates } from "@/types/cart";

// ─────────────────────────────────────────────────────────────────
// useCartSync
// ─────────────────────────────────────────────────────────────────
export function useCartSync(isAuthenticated: boolean): void {
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated || !cart) return;

    const interval = setInterval(() => {
        // fetchCart(); 
    }, CART_SYNC_INTERVAL);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cureway_cart" && e.newValue) {
        // Logic sync if needed
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isAuthenticated, cart, fetchCart]);
}

// ─────────────────────────────────────────────────────────────────
// useGeolocation
// ─────────────────────────────────────────────────────────────────
export function useGeolocation() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
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
// usePrevious
// ─────────────────────────────────────────────────────────────────
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}

// ─────────────────────────────────────────────────────────────────
// useMediaQuery
// ─────────────────────────────────────────────────────────────────
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener("change", callback);
      return () => matchMedia.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ─────────────────────────────────────────────────────────────────
// useWindowSize 
// ─────────────────────────────────────────────────────────────────
export function useWindowSize() {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, []);

  const getSnapshot = () => JSON.stringify({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const getServerSnapshot = () => JSON.stringify({ width: 0, height: 0 });

  const sizeString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  return useMemo(() => JSON.parse(sizeString), [sizeString]);
}

export function useWindowWidth() {
    const subscribe = useCallback((callback: () => void) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    }, []);
    return useSyncExternalStore(subscribe, () => window.innerWidth, () => 0);
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
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch (err) {
        console.error("useLocalStorage error:", err);
      }
    },
    [key]
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
  return ref;
}

// ─────────────────────────────────────────────────────────────────
// useIntersectionObserver
// ─────────────────────────────────────────────────────────────────
export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  
  const memoOptions = useMemo(() => ({
    root: options.root,
    rootMargin: options.rootMargin,
    threshold: options.threshold
  }), [options.root, options.rootMargin, options.threshold]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, memoOptions);

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, memoOptions]);

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
  
    return { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm };
  }