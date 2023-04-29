import UserCard from "./UserCard";

import "./UserCardList.css";

const UserCardList = ({ users }) => {
  return (
    <div className="user-card-list">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserCardList;
