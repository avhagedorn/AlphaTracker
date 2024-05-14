import { useEffect, useState } from "react";
import { INTERNAL_URL } from "./env";

function buildUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return new URL(`/api${path}`, INTERNAL_URL).toString();
}

export async function fetchServer(
  url: string, 
  options?: RequestInit
): Promise<{ loading: boolean; data: any | null; error: Error | null }> {
  const init: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(buildUrl(url), init);
  const data = await response.json();
  if (response.ok) {
    return { loading: false, data, error: null };
  } else {
    const errorMessage = (
      data.detail 
      || data.message 
      || data.status
    );
    return { loading: false, data: null, error: errorMessage };
  }
}

export default function useFetch(url: string, options?: RequestInit) {
  const [state, setState] = useState<{
    loading: boolean;
    data: any | null;
    error: Error | null;
  }>({ loading: true, data: null, error: null });

  useEffect(() => {
    fetchServer(url, options)
      .then((result) => {
        setState({ loading: false, data: result.data, error: result.error });
      })
      .catch((error) => {
        setState({ loading: false, data: null, error });
      });
  }, [url, options]);

  return state;
}
