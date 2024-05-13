import { INTERNAL_URL } from "./env";

function buildUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  return new URL(`/api${path}`, INTERNAL_URL).toString();
}

export default async function fetchServer(
  url: string, 
  options?: RequestInit
): Promise<Response> {
  const init: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    }
  };
  return fetch(buildUrl(url), init);
}
