import { describe, it, expect } from "vitest";
import { VERSION, TEAM } from "../src/index.js";

describe("index exports", () => {
  it("exports VERSION constant", () => {
    expect(VERSION).toBe("0.1.0");
    expect(typeof VERSION).toBe("string");
  });

  it("exports TEAM constant", () => {
    expect(TEAM).toBe("Beta / B-Labs");
    expect(typeof TEAM).toBe("string");
  });
});
