import fetchServer from "@/lib/fetch";
import { cookies } from "next/headers";

export default async function register(
    { 
        username, 
        email, 
        password, 
        confirm_password 
    } : { 
        username: string, 
        email: string, 
        password: string,
        confirm_password: string 
    }
) {
  return fetchServer("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password, confirm_password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to register");
      }
    })
    .then((data) => {
      cookies().set("access_token", data.access_token);
      return true;
    }).catch((error) => {
      console.error(error);
      return false;
    });
}
