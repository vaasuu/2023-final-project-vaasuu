import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import { useQuery } from "react-query";
import User from "./User";
import { afterEach, beforeEach, describe, expect, test, vitest } from "vitest";

vitest.mock("../../../api/users/users");
vitest.mock("../../../api/listings/listings");
vitest.mock("react-query");

describe("User component", () => {
  const auth = { token: "test-token", userId: "test-userId", isAdmin: false };

  beforeEach(() => {
    useQuery.mockReturnValue({
      isLoading: false,
      data: {
        user: {
          id: "test-userId",
          name: "Test User",
          created_at: "2022-05-01T00:00:00.000Z",
        },
      },
    });
  });

  afterEach(() => {
    vitest.resetAllMocks();
  });

  test("renders user details", async () => {
    render(
      <MemoryRouter initialEntries={["/users/test-userId"]}>
        <AuthContext.Provider value={auth}>
          <User />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText(/5\/1\/2022/i)).toBeInTheDocument();
  });
});
