import { render, screen } from "@testing-library/react";

import EditUser from "./EditUser";

import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

describe("EditUser", () => {
  it("renders the component", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EditUser />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("renders the form", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EditUser />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("New password")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Delete user")).toBeInTheDocument();
  });
});
