import fetchServer from "@/lib/fetch";

export default async function login(
    { 
      username, 
      password,
    } : {
      username: string, 
      password: string,
    }
) {
  const params = new URLSearchParams({
    username: username,
    password: password,
  }).toString();

  return fetchServer(
    `/auth/token?${params}`, 
    {
        method: "POST"
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to register");
      }
    })
    .then((_) => {
      return true;
    }).catch((error) => {
      console.error(error);
      return false;
    });
}
