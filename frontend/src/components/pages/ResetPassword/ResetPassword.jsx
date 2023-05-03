import { useState } from "react";
import { useMutation } from "react-query";
import { requestPasswordReset } from "../../../api/password-reset/password-reset";
import { resetPassword } from "../../../api/password-reset/password-reset";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../../../shared/utils/utils";

import "./ResetPassword.css";

const PasswordResetEmailRequest = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const passwordResetEmailRequestMutation = useMutation({
    mutationKey: "passwordResetEmailRequest",
    mutationFn: (email) => requestPasswordReset(email),
    onSuccess: () => {
      setSuccessMsg(
        "Password reset email sent. Please check your email for further instructions."
      );
      setErrorMsg(null);
    },
    onError: (errorData) => {
      setErrorMsg(errorData.error);
    },
  });

  const handlePasswordResetEmailRequest = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    passwordResetEmailRequestMutation.mutate(email);
  };

  return (
    <div>
      <h1>Request password reset email</h1>
      <form onSubmit={handlePasswordResetEmailRequest}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
        <button type="submit">Send Reset Email</button>
        <p className="error" role="alert">
          {errorMsg}
        </p>
        <p className="reset-password__success-msg" role="alert">
          {successMsg}
        </p>
      </form>
    </div>
  );
};

const ChangePassword = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const token = location.hash ? location.hash.substr(1) : null;

  const expiration = parseJwt(token).exp;
  const resetTokenExpired = Date.now() >= expiration * 1000;

  const passwordResetMutation = useMutation({
    mutationKey: "passwordReset",
    mutationFn: (password) => resetPassword(password, token),
    onSuccess: () => {
      navigate("/auth");
    },
    onError: (errorData) => {
      setErrorMsg(errorData.error);
    },
  });

  const handlePasswordResetRequest = (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    passwordResetMutation.mutate(password);
  };

  return (
    <div>
      {(resetTokenExpired && (
        <p className="error" role="alert">
          Password reset link has expired. Please request a new one.
        </p>
      )) || (
        <>
          <h1>Reset Password</h1>
          <form onSubmit={handlePasswordResetRequest}>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              maxLength={72}
            />
            <button type="submit">Reset Password</button>
            <p className="error" role="alert">
              {errorMsg}
            </p>
          </form>
        </>
      )}
    </div>
  );
};

const ResetPassword = () => {
  document.title = "Reset Password | Market";

  const token = location.hash ? location.hash.substr(1) : null;

  return (
    <div className="reset-password-page">
      {token ? <ChangePassword /> : <PasswordResetEmailRequest />}
    </div>
  );
};

export default ResetPassword;
