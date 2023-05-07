import { render, screen } from "@testing-library/react";

import MarketLayout from "./MarketLayout";
import { ProSidebarProvider } from "react-pro-sidebar";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe("MarketLayout", () => {
  it("renders sidebar", () => {
    render(
      <BrowserRouter>
        <ProSidebarProvider>
          <MarketLayout />
        </ProSidebarProvider>
      </BrowserRouter>
    );
    expect(screen.getByText("Listings")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Create new listing")).toBeInTheDocument();
    expect(screen.getByText("My profile")).toBeInTheDocument();
    expect(screen.getByText("User settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
