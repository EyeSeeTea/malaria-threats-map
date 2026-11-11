import { createInvasiveStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import {
    INVASIVE_STATUS_INVASIVE,
    INVASIVE_STATUS_NATIVE,
    INVASIVE_STATUS_NOT_FOUND,
} from "../../../../../domain/entities/__fixtures__/studyValues";
import { InvasiveStudy } from "../../../../../domain/entities/InvasiveStudy";
import { InvasiveMapType } from "../../../../store/types";
import { InvasiveStatusOrder, studySelector } from "../utils";

const RECENT = "recent";
const NOT_FOUND_STUDY = "notFound";
const UNKNOWN_STUDY = "unknown";
const WITHOUT_YEAR = "withoutYear";
const WITH_YEAR = "withYear";

const UNKNOWN = "UNKNOWN";

const study = (code: string, overrides: Partial<InvasiveStudy> = {}) =>
    createInvasiveStudy({ Code: code, YEAR_START: 2020, ...overrides });

const selectedCode = (group: InvasiveStudy[]) => studySelector(group, InvasiveMapType.VECTOR_OCCURANCE).Code;

describe("invasive site colour", () => {
    it("pins the status order record", () => {
        expect(InvasiveStatusOrder).toEqual({
            [UNKNOWN]: 0,
            [INVASIVE_STATUS_NATIVE]: 1,
            [INVASIVE_STATUS_INVASIVE]: 2,
        });
    });

    describe("studySelector, Vector occurrence", () => {
        it("picks the most recent year before the status", () => {
            const group = [
                study("older", { YEAR_START: 2019, INVASIVE_STATUS: INVASIVE_STATUS_INVASIVE }),
                study(RECENT, { YEAR_START: 2020, INVASIVE_STATUS: INVASIVE_STATUS_NATIVE }),
            ];

            expect(selectedCode(group)).toBe(RECENT);
        });

        it("orders invasive, native, unknown", () => {
            const group = [UNKNOWN, INVASIVE_STATUS_NATIVE, INVASIVE_STATUS_INVASIVE].map(status =>
                study(status, { INVASIVE_STATUS: status })
            );

            expect(selectedCode(group)).toBe(INVASIVE_STATUS_INVASIVE);
            expect(selectedCode(group.slice(0, 2))).toBe(INVASIVE_STATUS_NATIVE);
        });

        // Pins today's behaviour, a possible bug pending a decision: a status missing from the order
        // ties with unknown, so the order of the studies decides the colour.
        it("ties not found, which is not in the order, with unknown, so the first one wins", () => {
            const notFound = study(NOT_FOUND_STUDY, { INVASIVE_STATUS: INVASIVE_STATUS_NOT_FOUND });
            const unknown = study(UNKNOWN_STUDY, { INVASIVE_STATUS: UNKNOWN });

            expect(selectedCode([notFound, unknown])).toBe(NOT_FOUND_STUDY);
            expect(selectedCode([unknown, notFound])).toBe(UNKNOWN_STUDY);
        });

        // This test and the next pin today's behaviour, a possible bug pending a decision: whether the
        // studies without a year count depends on the first study of the group.
        it("uses the whole group when the first study has no YEAR_START", () => {
            const group = [
                study(WITHOUT_YEAR, { YEAR_START: undefined, INVASIVE_STATUS: INVASIVE_STATUS_NATIVE }),
                study(WITH_YEAR, { YEAR_START: 2015, INVASIVE_STATUS: INVASIVE_STATUS_INVASIVE }),
            ];

            expect(selectedCode(group)).toBe(WITH_YEAR);
        });

        it("ignores a study without YEAR_START when the first study has a year", () => {
            const group = [
                study(WITH_YEAR, { YEAR_START: 2015, INVASIVE_STATUS: INVASIVE_STATUS_NATIVE }),
                study(WITHOUT_YEAR, { YEAR_START: undefined, INVASIVE_STATUS: INVASIVE_STATUS_INVASIVE }),
            ];

            expect(selectedCode(group)).toBe(WITH_YEAR);
        });
    });
});
