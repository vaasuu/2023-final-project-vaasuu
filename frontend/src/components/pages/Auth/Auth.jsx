import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import "./Auth.css";
import { useMutation } from "react-query";
import { login, signup } from "../../../api/users/users";
import { AuthContext } from "../../../shared/context/auth-context";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const auth = useContext(AuthContext);

  const signupMutation = useMutation({
    mutationKey: "signup",
    mutationFn: signup,
    onSuccess: (data) => {
      auth.login(data.id, data.token, data.roles);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const loginMutation = useMutation({
    mutationKey: "login",
    mutationFn: login,
    onSuccess: (data) => {
      auth.login(data.id, data.token, data.roles);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data) => {
    if (isLogin) {
      loginMutation.mutate(data);
    } else {
      signupMutation.mutate(data);
    }
  };

  document.title = isLogin ? "Login | Marketplace" : "Register | Marketplace";

  return (
    <div className="container auth-form">
      <h1>{isLogin ? "Log in" : "Register an account"}</h1>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Register" : "Login"} instead?
      </button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          {!isLogin && (
            <>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                {...register("name", {
                  required: true,
                  maxLength: 255,
                })}
              />
              {errors.name && (
                <p role="alert" className="form-error">
                  Name is required
                </p>
              )}
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          />

          {errors.email && (
            <p role="alert" className="form-error">
              Email is required
            </p>
          )}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            minLength={8}
            maxLength={72}
            placeholder="password"
            {...register("password", {
              required: true,
              minLength: 8,
              maxLength: 72,
            })}
          />

          {errors.password && (
            <p className="form-error">Password is required</p>
          )}

          {!isLogin && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                minLength={8}
                maxLength={72}
                placeholder="password"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) => value === watch("password"),
                  minLength: 8,
                  maxLength: 72,
                })}
              />
              {errors.confirmPassword && (
                <p className="form-error">Passwords do not match</p>
              )}
            </>
          )}
          <input type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Auth;
