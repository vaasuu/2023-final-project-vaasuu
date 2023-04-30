export const requestPasswordReset = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/password-reset/send-reset-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
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

export const resetPassword = async (password, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/password-reset/set-new-password}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, token }),
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
