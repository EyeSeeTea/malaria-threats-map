import { createInvasiveStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { InvasiveStudy } from "../../../../../domain/entities/InvasiveStudy";
import { InvasiveMapType } from "../../../../store/types";
import { InvasiveStatusOrder, studySelector } from "../utils";

const INVASIVE = "Invasive";
const NATIVE = "Native";
const UNKNOWN = "UNKNOWN";
const NOT_FOUND = "Not found";

const study = (code: string, overrides: Partial<InvasiveStudy> = {}) =>
    createInvasiveStudy({ Code: code, YEAR_START: 2020, ...overrides });

const selectedCode = (group: InvasiveStudy[], mapType = InvasiveMapType.VECTOR_OCCURANCE) =>
    studySelector(group, mapType).Code;

describe("invasive site colour", () => {
    it("pins the status order record", () => {
        expect(InvasiveStatusOrder).toEqual({ [UNKNOWN]: 0, [NATIVE]: 1, [INVASIVE]: 2 });
    });

    describe("studySelector, Vector occurrence", () => {
        it("picks the most recent year before the status", () => {
            const group = [
                study("older", { YEAR_START: 2019, INVASIVE_STATUS: INVASIVE }),
                study("recent", { YEAR_START: 2020, INVASIVE_STATUS: NATIVE }),
            ];

            expect(selectedCode(group)).toBe("recent");
        });

        it("orders invasive, native, unknown", () => {
            const group = [UNKNOWN, NATIVE, INVASIVE].map(status => study(status, { INVASIVE_STATUS: status }));

            expect(selectedCode(group)).toBe(INVASIVE);
            expect(selectedCode(group.slice(0, 2))).toBe(NATIVE);
        });

        it("ties not found, which is not in the order, with unknown, so the first one wins (finding)", () => {
            const notFound = study("notFound", { INVASIVE_STATUS: NOT_FOUND });
            const unknown = study("unknown", { INVASIVE_STATUS: UNKNOWN });

            expect(selectedCode([notFound, unknown])).toBe("notFound");
            expect(selectedCode([unknown, notFound])).toBe("unknown");
        });

        it("uses the whole group when the first study has no YEAR_START", () => {
            const group = [
                study("withoutYear", { YEAR_START: undefined, INVASIVE_STATUS: NATIVE }),
                study("withYear", { YEAR_START: 2015, INVASIVE_STATUS: INVASIVE }),
            ];

            expect(selectedCode(group)).toBe("withYear");
        });

        it("ignores a study without YEAR_START when the first study has a year", () => {
            const group = [
                study("withYear", { YEAR_START: 2015, INVASIVE_STATUS: NATIVE }),
                study("withoutYear", { YEAR_START: undefined, INVASIVE_STATUS: INVASIVE }),
            ];

            expect(selectedCode(group)).toBe("withYear");
        });

        it("throws for an empty group (finding)", () => {
            expect(() => studySelector([], InvasiveMapType.VECTOR_OCCURANCE)).toThrow(TypeError);
        });
    });

    it("returns the first study of the group for an unknown map type", () => {
        const group = [study("first", { INVASIVE_STATUS: UNKNOWN }), study("second", { INVASIVE_STATUS: INVASIVE })];

        expect(selectedCode(group, 1)).toBe("first");
    });
});
