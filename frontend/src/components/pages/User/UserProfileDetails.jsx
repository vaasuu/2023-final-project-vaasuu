import "./UserProfileDetails.css";

const UserProfileDetails = ({ user }) => {
  return (
    <div className="user-profile-details">
      <div className="user-profile-details__avatar">
        <img src={`https://robohash.org/${user.id}&100x100`} />
      </div>
      <div className="user-profile-details__name">{user.name}</div>
      <div className="user-profile-details__joined-at">
        Joined on: {new Date(user.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default UserProfileDetails;
