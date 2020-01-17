import { abilityScoreMod, removeLowest } from "./character-creation";

describe("remove lowest", () => {
	it("should work", () => {
		expect(removeLowest([1, 2, 3, 4])).toEqual([2, 3, 4]);
	});

	it("should only remove a single lowest value ", () => {
		expect(removeLowest([1, 1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
	});

	it("should work when all values are the same ", () => {
		expect(removeLowest([1, 1, 1])).toEqual([1, 1]);
	});
});

describe("abilityScoreMod", () => {
	it("should work", () => {
		expect(abilityScoreMod(0)).toBe(-5);
		expect(abilityScoreMod(1)).toBe(-5);
		expect(abilityScoreMod(2)).toBe(-4);
		expect(abilityScoreMod(3)).toBe(-4);
		expect(abilityScoreMod(4)).toBe(-3);
		expect(abilityScoreMod(5)).toBe(-3);
		expect(abilityScoreMod(6)).toBe(-2);
		expect(abilityScoreMod(7)).toBe(-2);
		expect(abilityScoreMod(8)).toBe(-1);
		expect(abilityScoreMod(9)).toBe(-1);
		expect(abilityScoreMod(10)).toBe(0);
		expect(abilityScoreMod(11)).toBe(0);
		expect(abilityScoreMod(12)).toBe(1);
		expect(abilityScoreMod(13)).toBe(1);
		expect(abilityScoreMod(14)).toBe(2);
		expect(abilityScoreMod(15)).toBe(2);
		expect(abilityScoreMod(16)).toBe(3);
		expect(abilityScoreMod(17)).toBe(3);
		expect(abilityScoreMod(18)).toBe(4);
		expect(abilityScoreMod(19)).toBe(4);
		expect(abilityScoreMod(20)).toBe(5);
	});
});
