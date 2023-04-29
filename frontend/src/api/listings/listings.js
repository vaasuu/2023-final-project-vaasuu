import { BACKEND_URL } from "../../shared/utils/utils";

export const getUserListings = async (userId, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/listings/user/${userId}`, {
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