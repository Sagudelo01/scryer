import { describe, expect, it } from "vitest";
import { computeRoleReserve, reserveLevel } from "./reserve";
import type { Champion } from "./types";

function champion(id: string, tags: string[]): Champion {
  return { id, key: id, tags, names: { en: id, es: id } };
}

const champions: Champion[] = [
  champion("Garen", ["Fighter", "Tank"]),
  champion("Darius", ["Fighter"]),
  champion("Lux", ["Mage"]),
  champion("Ahri", ["Mage", "Assassin"]),
  champion("Jinx", ["Marksman"]),
];

describe("reserveLevel", () => {
  it("flags none, low and ok", () => {
    expect(reserveLevel(0)).toBe("none");
    expect(reserveLevel(3)).toBe("low");
    expect(reserveLevel(4)).toBe("ok");
    expect(reserveLevel(2, 2)).toBe("low");
  });
});

describe("computeRoleReserve", () => {
  it("counts totals per role from champion tags", () => {
    const reserve = computeRoleReserve(champions, new Set());
    const byRole = Object.fromEntries(reserve.map((r) => [r.role, r]));
    expect(byRole.Fighter.total).toBe(2);
    expect(byRole.Mage.total).toBe(2);
    expect(byRole.Marksman.total).toBe(1);
    expect(byRole.Tank.total).toBe(1);
    expect(byRole.Support.total).toBe(0);
  });

  it("subtracts unavailable champions from the available count", () => {
    const reserve = computeRoleReserve(champions, new Set(["Garen", "Lux"]));
    const byRole = Object.fromEntries(reserve.map((r) => [r.role, r]));
    expect(byRole.Fighter.available).toBe(1); // Darius left
    expect(byRole.Tank.available).toBe(0); // Garen was the only tank
    expect(byRole.Tank.level).toBe("none");
    expect(byRole.Mage.available).toBe(1); // Ahri left
  });

  it("marks a role with few options as low", () => {
    const reserve = computeRoleReserve(champions, new Set(), 1);
    const marksman = reserve.find((r) => r.role === "Marksman");
    expect(marksman).toMatchObject({ available: 1, level: "low" });
  });
});
