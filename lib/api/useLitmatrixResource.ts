"use client";

import { useEffect, useState } from "react";
import { apiGet, LitMatrixApiError } from "@/lib/api/litmatrixClient";

type ResourceState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
};

export function useLitmatrixResource<T>(endpoint: string): ResourceState<T> {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    apiGet<T>(endpoint)
      .then((data) => {
        if (active) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        const message =
          error instanceof LitMatrixApiError
            ? `${error.code}: ${error.message}`
            : "Unable to load LitMatrix data.";

        setState({ data: null, error: message, loading: false });
      });

    return () => {
      active = false;
    };
  }, [endpoint]);

  return state;
}
