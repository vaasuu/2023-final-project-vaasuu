import { BACKEND_URL } from "../../shared/utils/utils";

export const getRoles = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/roles`, {
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
