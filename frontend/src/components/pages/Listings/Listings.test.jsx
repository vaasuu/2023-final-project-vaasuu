import { render, screen } from "@testing-library/react";
import Listings from "./Listings";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

describe("Listings", () => {
  test("renders listings search bar", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Listings />
        </BrowserRouter>
      </QueryClientProvider>
    );
    const searchBar = screen.getByPlaceholderText(
      "Search title, description, category, location"
    );
    expect(searchBar).toBeInTheDocument();
  });

  test("renders loader", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Listings />
        </BrowserRouter>
      </QueryClientProvider>
    );
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });

  test("renders listings header", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Listings />
        </BrowserRouter>
      </QueryClientProvider>
    );
    const listingsHeader = screen.getByText("Listings");
    expect(listingsHeader).toBeInTheDocument();
  });
});
