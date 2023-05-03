import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Auth from "./Auth";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

describe("Auth page", () => {
  test("renders auth form correctly", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </QueryClientProvider>
    );
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Log in");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
  });

  test('switches to register form when "Register" button is clicked', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </QueryClientProvider>
    );
    const registerButton = screen.getByRole("button", {
      name: "Register instead?",
    });
    fireEvent.click(registerButton);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent("Register an account");
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();
    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();
  });
});
