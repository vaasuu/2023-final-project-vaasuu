import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EditListing from "./EditListing";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

describe("EditListing", () => {
  it("renders the component", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EditListing />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Edit Listing")).toBeInTheDocument();
    expect(screen.getByText("Delete Listing")).toBeInTheDocument();
  });
});
