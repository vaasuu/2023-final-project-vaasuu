import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import { getAllListings, searchListings } from "../../../api/listings/listings";
import ListingsList from "../../Listings/ListingsList/ListingsList";
import { SyncLoader } from "react-spinners";

import "./Listings.css";

const Listings = () => {
  document.title = "Listings | Marketplace";

  const auth = useContext(AuthContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [listings, setListings] = useState([]);

  const { isLoading: isLoadingAllListings } = useQuery({
    queryKey: ["all-listings", auth.token],
    queryFn: () => getAllListings(auth.token),
    enabled: !searchTerm, // disable this query when searching
    onSuccess: (data) => {
      setListings(data.listings);
    },
  });

  const listingsSearchMutation = useMutation({
    mutationKey: ["listings-search", auth.token],
    mutationFn: (s) => searchListings(auth.token, s),
    onSuccess: (data) => {
      setListings(data.listings);
    },
  });

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 3) {
      listingsSearchMutation.mutate(e.target.value);
    }
  };

  // update the query params in url when the search term changes
  useEffect(() => {
    if (searchTerm) {
      searchParams.set("q", searchTerm);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
    handleSearchTermChange({ target: { value: searchTerm } });
  }, [searchTerm, auth.isLoggedIn]);

  return (
    <div>
      <h1>Listings</h1>
      <div className="search-bar">
        <input
          className="search-bar-input"
          type="search"
          placeholder="Search title, description, category, location"
          value={searchTerm}
          onChange={handleSearchTermChange}
          minLength={3}
        />
      </div>
      {isLoadingAllListings && <SyncLoader data-testid="loader" />}
      {listings.length > 0 && (
        <div>
          <ListingsList listings={listings} />
        </div>
      )}
    </div>
  );
};

export default Listings;
