import { formatRelativeTime } from "../time";

const now = new Date("2026-08-15T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("returns 'ahora' for sub-minute diffs", () => {
    expect(
      formatRelativeTime("2026-08-15T11:59:40.000Z", now)
    ).toBe("ahora");
  });

  it("formats minutes", () => {
    expect(formatRelativeTime("2026-08-15T11:55:00.000Z", now)).toBe(
      "hace 5 min"
    );
    expect(formatRelativeTime("2026-08-15T11:59:00.000Z", now)).toBe(
      "hace 1 min"
    );
  });

  it("formats hours", () => {
    expect(formatRelativeTime("2026-08-15T09:00:00.000Z", now)).toBe(
      "hace 3 h"
    );
  });

  it("formats days", () => {
    expect(formatRelativeTime("2026-08-10T12:00:00.000Z", now)).toBe(
      "hace 5 d"
    );
  });

  it("clamps future timestamps to 'ahora'", () => {
    expect(
      formatRelativeTime("2026-08-15T12:30:00.000Z", now)
    ).toBe("ahora");
  });

  it("returns empty string for invalid dates", () => {
    expect(formatRelativeTime("no-es-fecha", now)).toBe("");
  });
});
