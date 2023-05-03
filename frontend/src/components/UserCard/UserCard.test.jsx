import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserCard from "./UserCard";

describe("UserCard", () => {
  const user = {
    id: "abc123",
    name: "John Doe",
  };

  test("renders user avatar and name", () => {
    render(
      <BrowserRouter>
        <UserCard user={user} />
      </BrowserRouter>
    );

    const avatarElement = screen.getByRole("img");
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement).toHaveAttribute(
      "src",
      `https://robohash.org/${user.id}&100x100`
    );

    const nameElement = screen.getByText(user.name);
    expect(nameElement).toBeInTheDocument();
  });

  test("has a link to user profile", () => {
    render(
      <BrowserRouter>
        <UserCard user={user} />
      </BrowserRouter>
    );

    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", `/market/users/${user.id}`);
  });
});
