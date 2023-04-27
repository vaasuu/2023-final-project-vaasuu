import { Link } from "react-router-dom";

import "./UserCard.css";

const UserCard = ({ user }) => {
  return (
    <Link className="user-card-link" to={`/market/users/${user.id}`}>
      <div className="user-card">
        <div className="user-card__avatar">
          <img src={`https://robohash.org/${user.id}&100x100`} />
        </div>
        <div className="user-card__name">{user.name}</div>
      </div>
    </Link>
  );
};

export default UserCard;
