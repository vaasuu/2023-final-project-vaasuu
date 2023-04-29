import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { getUser, updateUser } from "../../../api/users/users";

import "./EditUser.css";

const EditUser = () => {
  const [userName, setUserName] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // set the page title to show the user name
  document.title = `Edit user | ${userName} | Marketplace`;

  const auth = useContext(AuthContext);
  const { id } = useParams();

  const { isLoading: userDataIsLoading, data: userData } = useQuery({
    queryKey: ["userGet", id, auth.token],
    queryFn: () => getUser(id, auth.token),
  });

  // set the user name when the user data is fetched
  useEffect(() => {
    if (userData) {
      setUserName(userData.user.name);
    }
  }, [userData]);

  let data = {};

  const updateUserMutation = useMutation({
    mutationKey: ["userEdit", id, auth.token, data],
    mutationFn: () => updateUser(id, auth.token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["userGet", id, auth.token]);
      navigate(`/market/users/${id}`);
    },
    onError: (errorData) => {
      setErrorMsg(errorData.error);
    },
  });

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const adminRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    data = {
      name: nameRef.current.value, // always send the name as it errors if only roles are sent
      email:
        emailRef.current.value === userData?.user?.email
          ? undefined
          : emailRef.current.value,
      password: passwordRef?.current?.value
        ? passwordRef.current.value
        : undefined,
      roles: adminRef.current.checked ? ["admin"] : ["normal"],
    };

    updateUserMutation.mutate(data);
  };

  return (
    <div className="edit-user-page">
      <h1>EditUser</h1>
      <div className="edit-user__form-control">
        <form className="edit-user__form" onSubmit={submitHandler}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            ref={nameRef}
            defaultValue={userData?.user?.name}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            ref={emailRef}
            defaultValue={userData?.user?.email}
          />

          <label htmlFor="password">New password</label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordRef}
          />

          {auth.isAdmin && userData?.user && (
            <>
              <label htmlFor="isAdmin">Is admin</label>
              <input
                type="checkbox"
                name="admin"
                id="admin"
                ref={adminRef}
                defaultChecked={userData.user.roles.includes("admin")}
                disabled={userData.user.roles.includes("admin")}
              />
            </>
          )}

          <button type="submit">Save</button>
        </form>
        {errorMsg && <p className="form-error">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default EditUser;
