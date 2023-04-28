import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { getAllUsers } from "../../../api/users/users";
import { AuthContext } from "../../../shared/context/auth-context";
import UserCardList from "../../UserCard/UserCardList";

import "./Users.css";

const Users = () => {
  document.title = "Users | Marketplace";

  const auth = useContext(AuthContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const { isLoading, data } = useQuery({
    queryKey: ["users", auth.token],
    queryFn: () => getAllUsers(auth.token),
  });

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // update the query params in url when the search term changes
  useEffect(() => {
    if (searchTerm) {
      searchParams.set("q", searchTerm);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  }, [searchTerm]);

  // Just filter the users on the client side as the whole data is already fetched
  const filteredUsers = data?.users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-page">
      {isLoading && <SyncLoader />}
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      {data && <UserCardList users={filteredUsers} />}
    </div>
  );
};

export default Users;
