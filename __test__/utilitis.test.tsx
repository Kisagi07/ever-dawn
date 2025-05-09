import Time from "@/app/classes/Time";
import calculateRythmScheme from "@/utils/calculateRythmScheme";
import { expect, test, describe, it } from "vitest";

describe("Utilities", () => {
  describe("calculateRythmScheme", () => {
    const hourEnd = new Time("10:00:00");
    const hourStart = new Time("09:00:00");
    const maxFocus = 25;
    it("Percentage type work properly", () => {
      const focusTarget = "percentage";
      const result = calculateRythmScheme(hourStart, hourEnd, focusTarget, maxFocus, { percentage: 50 });

      expect(result).toEqual(
        expect.arrayContaining([expect.objectContaining({ focus: 1500, break: 900 }), expect.objectContaining({ focus: 300, break: 900 })])
      );
    });

    it("Goal work properly", () => {
      const focusTarget = "today goal";
      const result = calculateRythmScheme(hourStart, hourEnd, focusTarget, maxFocus, { todayGoal: 50 });

      expect(result).toEqual(
        expect.arrayContaining([expect.objectContaining({ focus: 1500, break: 300 }), expect.objectContaining({ focus: 1500, break: 300 })])
      );
    });

    it("Start with break", () => {
      const focusTarget = "today goal";
      const result = calculateRythmScheme(hourStart, hourEnd, focusTarget, maxFocus, { todayGoal: 50, startWithBreak: true });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ break: 200 }),
          expect.objectContaining({ focus: 1500, break: 200 }),
          expect.objectContaining({ focus: 1500, break: 200 }),
        ])
      );
    });
  });
});
