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

      const data = await res.json();
      if (res.status === 201) {
        resolve(data);
      } else {
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

      const data = await res.json();
      if (res.status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getAllUsers = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const getUser = async (userId, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const updateUser = async (
  userId,
  token,
  { name, email, password, roles }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, roles }),
      });

      const data = await res.json();
      if (res.status === 204) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const deleteUser = async (userId, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        resolve();
      } else {
        const data = await res.json();
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const searchUsers = async (token, searchTerm) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/users/search?name=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    } catch (err) {
      reject(err);
    }
  });
};
