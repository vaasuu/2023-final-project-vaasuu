import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getUser } from "../../../api/users/users";
import { AuthContext } from "../../../shared/context/auth-context";
import { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { getUserListings } from "../../../api/listings/listings";
import UserProfileDetails from "./UserProfileDetails";
import ListingsList from "../../Listings/ListingsList/ListingsList";

const User = () => {
  const [userName, setUserName] = useState("");

  // set the page title to show the user name
  document.title = `User | ${userName} | Marketplace`;

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

  const { isLoading: usersListingsIsLoading, data: usersListings } = useQuery({
    queryKey: ["userListings", id, auth.token],
    queryFn: () => getUserListings(id, auth.token),
  });

  return (
    <div>
      <h1> User </h1>
      {userDataIsLoading && <SyncLoader />}
      {userData && <UserProfileDetails user={userData.user} />}

      {usersListingsIsLoading && <SyncLoader />}
      {!usersListingsIsLoading && (
        <ListingsList listings={usersListings?.listings} />
      )}
    </div>
  );
};

export default User;
