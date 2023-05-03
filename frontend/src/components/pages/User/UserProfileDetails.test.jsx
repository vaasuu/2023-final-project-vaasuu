import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UserProfileDetails from "./UserProfileDetails";
import { AuthContext } from "../../../shared/context/auth-context";
import { describe, expect, test } from "vitest";

describe("UserProfileDetails", () => {
  test("renders user profile details correctly", () => {
    const user = {
      id: "1",
      name: "John Doe",
      created_at: "2022-05-01",
    };

    const auth = {
      userId: "1",
      isAdmin: false,
    };

    render(
      <AuthContext.Provider value={auth}>
        <Router>
          <UserProfileDetails user={user} />
        </Router>
      </AuthContext.Provider>
    );

    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();

    const name = screen.getByText("John Doe");
    expect(name).toBeInTheDocument();

    const joinedAt = screen.getByText("Joined on: 5/1/2022");
    expect(joinedAt).toBeInTheDocument();

    const editProfileLink = screen.getByRole("link", {
      href: "/market/users/1/edit",
    });
    expect(editProfileLink).toBeInTheDocument();
  });
});
