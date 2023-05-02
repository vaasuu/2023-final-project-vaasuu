import { useContext, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { createListing } from "../../../api/listings/listings";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import ListingForm from "../../Listings/ListingForm/ListingForm";

const NewListing = () => {
  document.title = "New Listing | Marketplace";

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    currency: "",
    location: "",
    image_urls: [],
  });

  const newListingMutation = useMutation({
    mutationKey: ["newListing", auth.token, formData],
    mutationFn: (formData) => createListing(auth.token, formData),
    onSuccess: (data) => {
      console.log(data);
      navigate(`/market/listings/${data.id}`);
    },
    onError: (data) => {
      setErrorMsg(data.error);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    newListingMutation.mutate(formData);
  };

  return (
    <div className="new-listing">
      <h1>New Listing</h1>
      <ListingForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitButtonText="Create Listing"
        errorMsg={errorMsg}
      />
    </div>
  );
};

export default NewListing;
