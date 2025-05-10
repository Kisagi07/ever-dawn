import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SolCycle from "@/app/components/SolCycle";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/sol-cycle"),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams(`scheme=[{"focus":25, "break":25, "id": 2431231}]`)),
}));

describe("Sol Cycle Page", () => {
  it("Contains star selection", () => {
    Object.defineProperty(global, "Notification", {
      value: {
        permission: "granted",
      },
      writable: true,
    });

    render(<SolCycle />);
    expect(screen.getByTestId("star-selection")).toBeDefined();
  });
});
