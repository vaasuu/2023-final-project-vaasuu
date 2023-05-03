import { render, screen } from "@testing-library/react";
import ListingForm from "./ListingForm";
import { beforeEach, describe, expect, test, vitest } from "vitest";
import { QueryClient, QueryClientProvider } from "react-query";

describe("ListingForm", () => {
  const formData = {
    title: "test",
    description: "test description",
    category: "category1",
    price: "100",
    currency: "USD",
    location: "test location",
    image_urls: [],
  };

  const setFormData = vitest.fn();
  const handleSubmit = vitest.fn();

  beforeEach(() => {
    setFormData.mockClear();
    handleSubmit.mockClear();
  });

  test("renders input fields and submit button", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListingForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          errorMsg=""
          submitButtonText="Submit"
        />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Image URLs")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("renders error message if provided", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ListingForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          errorMsg="test error message"
          submitButtonText="Submit"
        />
      </QueryClientProvider>
    );

    expect(screen.getByText("test error message")).toBeInTheDocument();
  });
});
