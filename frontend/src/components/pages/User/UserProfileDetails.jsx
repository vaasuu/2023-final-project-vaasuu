import { Link } from "react-router-dom";
import "./UserProfileDetails.css";
import { GrSettingsOption } from "react-icons/gr";
import { AuthContext } from "../../../shared/context/auth-context";
import { useContext } from "react";

const UserProfileDetails = ({ user }) => {
  const auth = useContext(AuthContext);
  const shouldShowEditProfileButton = auth.userId === user.id || auth.isAdmin;

  return (
    <div className="user-profile-details">
      <div className="user-profile-details__avatar">
        <img src={`https://robohash.org/${user.id}&100x100`} />
      </div>
      <div className="user-profile-details__name">{user.name}</div>
      <div className="user-profile-details__joined-at">
        Joined on: {new Date(user.created_at).toLocaleDateString()}
      </div>
      {shouldShowEditProfileButton && (
        <div className="user-profile-details__edit-profile-button">
          <Link id="editProfileLink" to={`/market/users/${user.id}/edit`}>
            <GrSettingsOption />
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfileDetails;
