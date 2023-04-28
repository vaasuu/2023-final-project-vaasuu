import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getUser } from "../../../api/users/users";
import { AuthContext } from "../../../shared/context/auth-context";
import { useContext } from "react";
import { SyncLoader } from "react-spinners";
import { getUserListings } from "../../../api/listings/listings";
import UserProfileDetails from "./UserProfileDetails";

const User = () => {
  document.title = "User | Marketplace";

  const auth = useContext(AuthContext);
  const { id } = useParams();

  const { isLoading: userDataIsLoading, data: userData } = useQuery(
    ["userGet", id, auth.token],
    getUser
  );

  const { isLoading: usersListingsIsLoading, data: usersListings } = useQuery(
    ["userListings", id, auth.token],
    getUserListings
  );

  console.log(userData);
  console.log(usersListings);

  return (
    <div>
      <h1> User </h1>
      {userDataIsLoading && <SyncLoader />}
      {userData && <UserProfileDetails user={userData.user} />}
    </div>
  );
};

export default User;
