import { BACKEND_URL } from "../../shared/utils/utils";

export const signup = async ({ name, email, password }) => {
  const res = await (`${BACKEND_URL}/api/v1/users/signup`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });
  return (await res).json();
};

export const login = async ({ email, password }) => {
  const res = await fetch(`${BACKEND_URL}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
};
