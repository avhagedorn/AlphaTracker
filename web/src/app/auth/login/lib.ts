import { fetchServer } from "@/lib/fetch";

export default function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const params = new URLSearchParams({
    username: username,
    password: password,
  }).toString();

  return fetchServer(`/auth/token?${params}`, {
    method: "POST",
  });
}
