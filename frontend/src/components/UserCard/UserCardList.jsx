import UserCard from "./UserCard";

import "./UserCardList.css";

const UserCardList = ({ users }) => {
  if (users?.length == 0) {
    return <div> No users found </div>;
  }
  return (
    <div className="user-card-list">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserCardList;
