import ListingCard from "../ListingCard/ListingCard";

import "./ListingsList.css";

const ListingsList = ({ listings }) => {
  if (!listings?.length) {
    return <div className="listings-list__empty"> No listings found </div>;
  }

  return (
    <div className="listings-list">
      {listings.map((listing) => (
        <ListingCard key={listing.listing_id} listingData={listing} />
      ))}
    </div>
  );
};

export default ListingsList;
