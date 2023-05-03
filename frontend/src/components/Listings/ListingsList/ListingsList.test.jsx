import { render, screen } from "@testing-library/react";
import ListingsList from "./ListingsList";
import { BrowserRouter } from "react-router-dom";

const mockListings = [
  {
    listing_id: "1",
    title: "Listing 1",
    description: "This is listing 1",
    asking_price: 10.0,
    currency: "USD",
    location: "Location 1",
    picture_url: "https://example.com/picture1.jpg",
    blurhash: "abcdef12345678",
  },
  {
    listing_id: "2",
    title: "Listing 2",
    description: "This is listing 2",
    asking_price: 20.0,
    currency: "EUR",
    location: "Location 2",
    picture_url: "https://example.com/picture2.jpg",
    blurhash: "abcdef12345678",
  },
];

describe("ListingsList", () => {
  it("renders a message when there are no listings", () => {
    render(<ListingsList />);
    expect(screen.getByText("No listings found")).toBeInTheDocument();
  });

  it("renders all the listings it is given", () => {
    render(
      <BrowserRouter>
        <ListingsList listings={mockListings} />
      </BrowserRouter>
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
