import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ListingCard from "./ListingCard";
import { describe, expect, it } from "vitest";

describe("ListingCard", () => {
  const listingData = {
    listing_id: "123",
    title: "Example Listing",
    description: "This is an example listing",
    asking_price: "10.00",
    currency: "USD",
    location: "Example Location",
    picture_url: "https://example.com/picture.jpg",
    blurhash: "L6B|HM0J00tS00-;-;RP00-;~qMx",
  };

  it("renders the listing title", () => {
    render(
      <BrowserRouter>
        <ListingCard listingData={listingData} />
      </BrowserRouter>
    );

    const titleElement = screen.getByText("Example Listing");
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the listing description", () => {
    render(
      <BrowserRouter>
        <ListingCard listingData={listingData} />
      </BrowserRouter>
    );

    const descriptionElement = screen.getByText("This is an example listing");
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the listing price and currency", () => {
    render(
      <BrowserRouter>
        <ListingCard listingData={listingData} />
      </BrowserRouter>
    );

    // there is a class called "listing-card__price"
    const priceElement = document.querySelector(".listing-card__price");
    expect(priceElement).toBeInTheDocument();
    expect(priceElement).toHaveTextContent("10.00");
    expect(priceElement).toHaveTextContent("USD");
  });

  it("renders the listing location", () => {
    render(
      <BrowserRouter>
        <ListingCard listingData={listingData} />
      </BrowserRouter>
    );

    const locationElement = screen.getByText("Example Location");
    expect(locationElement).toBeInTheDocument();
  });

  it("renders the listing image with blurhash", () => {
    render(
      <BrowserRouter>
        <ListingCard listingData={listingData} />
      </BrowserRouter>
    );

    const image = screen.getByRole("img", { name: "Example Listing" });
    expect(image).toHaveAttribute("src", "https://example.com/picture.jpg");
    expect(image).toHaveAttribute("alt", "Example Listing");

    const blurhashDiv = image.parentElement.firstChild;
    expect(blurhashDiv.firstChild.tagName).toBe("CANVAS");
  });
});
