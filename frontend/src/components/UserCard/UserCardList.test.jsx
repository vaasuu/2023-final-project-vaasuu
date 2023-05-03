import { render, screen } from "@testing-library/react";
import UserCardList from "./UserCardList";
import { BrowserRouter } from "react-router-dom";

describe("UserCardList", () => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  it("renders a list of user cards", () => {
    render(
      <BrowserRouter>
        <UserCardList users={users} />
      </BrowserRouter>
    );

    const userCards = screen.getAllByRole("link");
    expect(userCards).toHaveLength(users.length);

    // for each user, check that the user card has the correct link, avatar, and name
    users.forEach((user, index) => {
      const userCard = userCards[index];
      expect(userCard).toHaveAttribute("href", `/market/users/${user.id}`);

      const avatarImg = userCard.querySelector(".user-card__avatar img");
      expect(avatarImg).toHaveAttribute(
        "src",
        `https://robohash.org/${user.id}&100x100`
      );

      const nameText = userCard.querySelector(".user-card__name");
      expect(nameText).toHaveTextContent(user.name);
    });
  });
});
