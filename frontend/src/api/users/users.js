import { BACKEND_URL } from "../../shared/utils/utils";

export const signup = async ({ name, email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.status === 201) {
        const data = await res.json();
        resolve(data);
      } else {
        const data = await res.json();
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const login = async ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const data = await res.json();
        resolve(data);
      } else {
        const data = await res.json();
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getAllUsers = async ({ queryKey }) => {
  const [_, token] = queryKey;
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        resolve(data);
      } else {
        const data = await res.json();
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        const data = await res.json();
        resolve(data);
      } else {
        const data = await res.json();
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};
