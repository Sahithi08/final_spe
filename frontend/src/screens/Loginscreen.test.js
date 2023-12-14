import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Loginscreen from "./Loginscreen";

jest.mock("axios");

describe("Loginscreen Component", () => {
  test("renders login form with input fields and button", () => {
    render(<Loginscreen />, { wrapper: MemoryRouter });

    // Check if email and password input fields are present
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("user can enter email and password", () => {
    render(<Loginscreen />, { wrapper: MemoryRouter });

    // User enters email and password
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    // Check if the entered values are updated in the input fields
    expect(screen.getByPlaceholderText(/email/i).value).toBe("test@example.com");
    expect(screen.getByPlaceholderText(/password/i).value).toBe("password123");
  });

  test("user can click login button", async () => {
    render(<Loginscreen />, { wrapper: MemoryRouter });

    // Mocking Axios post request
    axios.post.mockResolvedValue({ data: {} });

    // User enters email and password
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    // Click the login button
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check if Axios post request is called with the correct data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        process.env.REACT_APP_BASE_URL + "/api/users/login",
        { email: "test@example.com", password: "password123" }
      );
    });
  });
});
