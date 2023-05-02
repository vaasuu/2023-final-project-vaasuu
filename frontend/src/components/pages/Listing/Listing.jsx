import { SyncLoader } from "react-spinners";
import { getListingById } from "../../../api/listings/listings";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import ImageGallery from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";
import "./Listing.css";

const Listing = () => {
  document.title = "Listing | Marketplace";

  const auth = useContext(AuthContext);
  const { id } = useParams();

  const {
    data: listingData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["listing", id, auth.token],
    queryFn: () => getListingById(auth.token, id),
  });

  const listing = listingData?.listing;
  // map the image data to the format required by the ImageGallery component
  const images = listing?.image_data.map((image) => ({
    original: image.url,
  }));

  return (
    <div className="listing">
      {isLoading && <SyncLoader />}
      {isError && <p>{error.error}</p>}
      {listingData && (
        <>
          {images.length > 0 && <ImageGallery items={images} />}
          <h1>{listing.title}</h1>
          <p className="listing__info">{listing.description}</p>
          <p className="listing__info">
            Price: {listing.asking_price} {listing.currency}
          </p>
          <p className="listing__info">Category: {listing.category}</p>
          <p className="listing__info">Location: {listing.location}</p>
          <p className="listing__info">
            Owner:{" "}
            <Link to={`/market/users/${listing.owner}`}>
              {" "}
              {listing.owner_name}{" "}
            </Link>{" "}
          </p>
          <p className="listing__info">
            Listing created: {new Date(listing.created_at).toLocaleString()}
          </p>
          <p className="listing__info">
            Listing updated: {new Date(listing.updated_at).toLocaleString()}
          </p>
          {(listingData?.listing?.owner === auth.userId || auth.isAdmin) && (
            <Link to={`/market/listings/${listing.listing_id}/edit`}>Edit</Link>
          )}
        </>
      )}
    </div>
  );
};

export default Listing;
