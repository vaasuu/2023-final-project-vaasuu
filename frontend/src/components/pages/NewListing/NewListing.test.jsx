import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../../shared/context/auth-context";

import NewListing from "./NewListing";
import { beforeEach, describe, expect, it, vitest } from "vitest";

vitest.mock("react-query");
vitest.mock("react-router-dom", () => ({
  useNavigate: vitest.fn(),
}));

describe("NewListing", () => {
  const setFormData = vitest.fn();
  const handleSubmit = vitest.fn();

  beforeEach(() => {
    setFormData.mockClear();
    handleSubmit.mockClear();
  });

  it("renders the component", async () => {
    render(
      <AuthContext.Provider value={{ token: "token" }}>
        <NewListing />
      </AuthContext.Provider>
    );

    expect(screen.getByText("New Listing")).toBeInTheDocument();
  });
});
