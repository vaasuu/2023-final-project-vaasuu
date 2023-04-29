import { Link } from "react-router-dom";

import "./ListingCard.css";

const ListingCard = ({ listingData }) => {
  const {
    listing_id,
    title,
    description,
    asking_price,
    currency,
    location,
    picture_url,
    blurhash,
  } = listingData;

  return (
    <div className="listing-card">
      <Link
        className="listing-card__link"
        to={`/market/listings/${listing_id}`}
      >
        {picture_url && (
          <div className="listing-card__image">
            <img src={picture_url} alt={title} />
          </div>
        )}
        <p className="listing-card__title">{title}</p>
        <p className="listing-card__description">{description}</p>
        <p className="listing-card__price">
          {asking_price} {currency}
        </p>
        <p className="listing-card__location">{location}</p>
      </Link>
    </div>
  );
};

export default ListingCard;
