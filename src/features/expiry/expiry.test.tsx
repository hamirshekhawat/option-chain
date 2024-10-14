import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ExpiryList } from "./ExpirySelect";

const mockExpiries = ["2024-10-14", "2024-11-15", "2024-12-20"];
const mockSelectedExpiry = "2024-10-14";
const mockOnChange = jest.fn();

describe("ExpiryList Component", () => {
  it("rendre list of expiry buttons", () => {
    render(
      <ExpiryList
        expiryList={mockExpiries}
        selectedExpiry={mockSelectedExpiry}
        onChange={mockOnChange}
      />
    );

    mockExpiries.forEach((expiry) => {
      const button = screen.getByText(expiry);
      expect(button).toBeInTheDocument();
    });
  });

  it("highlight selected expiry", () => {
    render(
      <ExpiryList
        expiryList={mockExpiries}
        selectedExpiry={mockSelectedExpiry}
        onChange={mockOnChange}
      />
    );

    const selectedButton = screen.getByText(mockSelectedExpiry);
    expect(selectedButton).toHaveClass("MuiButton-contained");
  });

  it("calls onChange when on expiry button clck", () => {
    render(
      <ExpiryList
        expiryList={mockExpiries}
        selectedExpiry={mockSelectedExpiry}
        onChange={mockOnChange}
      />
    );

    const secondExpiryButton = screen.getByText(mockExpiries[1]);
    fireEvent.click(secondExpiryButton);

    expect(mockOnChange).toHaveBeenCalledWith(mockExpiries[1]);
  });
});
