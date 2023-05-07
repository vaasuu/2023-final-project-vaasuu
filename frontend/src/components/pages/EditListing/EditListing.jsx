import { useContext, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import {
  getListingById,
  updateListing,
  deleteListing,
} from "../../../api/listings/listings";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import ListingForm from "../../Listings/ListingForm/ListingForm";
import { SyncLoader } from "react-spinners";

const EditListing = () => {
  document.title = "Edit Listing | Marketplace";

  const { id } = useParams();
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState(null);

  const { isLoading } = useQuery({
    queryKey: ["listingGet", auth.token, id],
    queryFn: () => getListingById(auth.token, id),
    onSuccess: (listingData) => {
      const defaultFormData = {
        title: listingData?.listing.title,
        description: listingData?.listing.description,
        category: listingData?.listing.category,
        price: listingData?.listing.asking_price,
        currency: listingData?.listing.currency,
        location: listingData?.listing.location,
        image_urls: listingData?.listing.image_data.map((img) => img.url),
      };

      setFormData(defaultFormData);
    },
    enabled: !formData, // fetch once
  });

  const EditListingMutation = useMutation({
    mutationKey: ["EditListing", auth.token, formData],
    mutationFn: (formData) => updateListing(auth.token, id, formData),
    onSuccess: () => {
      navigate(`/market/listings/${id}`);
    },
    onError: (data) => {
      setErrorMsg(data.error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    EditListingMutation.mutate(formData);
  };

  const DeleteListingMutation = useMutation({
    mutationKey: ["DeleteListing", auth.token, id],
    mutationFn: () => deleteListing(auth.token, id),
    onSuccess: () => {
      navigate(`/market/listings`);
    },
    onError: (data) => {
      setErrorMsg(data.error);
    },
  });

  const handleDelete = (event) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this listing?")) {
      DeleteListingMutation.mutate();
    }
  };

  return (
    <div className="edit-listing">
      <h1>Edit Listing</h1>
      {isLoading && <SyncLoader />}
      {formData && (
        <ListingForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          submitButtonText="Save changes"
          errorMsg={errorMsg}
        />
      )}
      <button
        style={{ background: "#d0342c", color: "#fff" }}
        onClick={handleDelete}
      >
        Delete Listing
      </button>
    </div>
  );
};

export default EditListing;
