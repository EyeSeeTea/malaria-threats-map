import { createPreventionStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { PreventionMapType } from "../../../../store/types";
import {
    getByMostRecentYearAndInvolvement,
    getMostPriorityStudiesUsingMechanismProxy,
    getMostPriorityUsingMortalityAdjusted,
    studySelector,
} from "../utils";

const study = (code: string, overrides: Partial<PreventionStudy> = {}) =>
    createPreventionStudy({ Code: code, YEAR_START: 2020, ...overrides });

const selectedCode = (group: PreventionStudy[], mapType: PreventionMapType) => studySelector(group, mapType).Code;

const codes = (studies: PreventionStudy[]) => studies.map(({ Code }) => Code);

describe("prevention site colour", () => {
    describe("studySelector", () => {
        describe("Resistance status", () => {
            const mapType = PreventionMapType.RESISTANCE_STATUS;

            it("picks the most recent year before the status", () => {
                const group = [
                    study("older", { YEAR_START: 2019, RESISTANCE_STATUS: "CONFIRMED_RESISTANCE" }),
                    study("recent", { YEAR_START: 2020, RESISTANCE_STATUS: "SUSCEPTIBLE" }),
                ];

                expect(selectedCode(group, mapType)).toBe("recent");
            });

            it("orders the statuses confirmed, possible, susceptible, undetermined", () => {
                const statuses = ["UNDETERMINED", "SUSCEPTIBLE", "POSSIBLE_RESISTANCE", "CONFIRMED_RESISTANCE"];
                const group = statuses.map(status => study(status, { RESISTANCE_STATUS: status }));

                expect(selectedCode(group, mapType)).toBe("CONFIRMED_RESISTANCE");
                expect(selectedCode(group.slice(0, 3), mapType)).toBe("POSSIBLE_RESISTANCE");
                expect(selectedCode(group.slice(0, 2), mapType)).toBe("SUSCEPTIBLE");
                expect(selectedCode(group.slice(0, 1), mapType)).toBe("UNDETERMINED");
            });

            it("returns a copy of the study with its priority", () => {
                const confirmed = study("confirmed", { RESISTANCE_STATUS: "CONFIRMED_RESISTANCE" });

                expect(studySelector([confirmed], mapType)).toEqual({ ...confirmed, priority: 1 });
            });

            it("keeps the first study of the group on a tie", () => {
                const group = [
                    study("first", { RESISTANCE_STATUS: "POSSIBLE_RESISTANCE" }),
                    study("second", { RESISTANCE_STATUS: "POSSIBLE_RESISTANCE" }),
                ];

                expect(selectedCode(group, mapType)).toBe("first");
            });

            it("lets the input order decide for a status missing from the record (finding)", () => {
                const unknown = study("unknown", { RESISTANCE_STATUS: "NA" });
                const confirmed = study("confirmed", { RESISTANCE_STATUS: "CONFIRMED_RESISTANCE" });

                expect(selectedCode([unknown, confirmed], mapType)).toBe("unknown");
                expect(selectedCode([confirmed, unknown], mapType)).toBe("confirmed");
            });
        });

        describe("Intensity status", () => {
            const mapType = PreventionMapType.INTENSITY_STATUS;

            it("picks the most recent year before the intensity", () => {
                const group = [
                    study("older", { YEAR_START: 2019, RESISTANCE_INTENSITY: "HIGH_INTENSITY" }),
                    study("recent", { YEAR_START: 2020, RESISTANCE_INTENSITY: "LOW_INTENSITY" }),
                ];

                expect(selectedCode(group, mapType)).toBe("recent");
            });

            it("orders high, moderate, moderate to high, low, and then NA and not assessed (finding)", () => {
                const group = [
                    study("NA", { RESISTANCE_INTENSITY: "NA" }),
                    study("COULD_NOT_BE_RELIABLY_ASSESSED", { RESISTANCE_INTENSITY: "COULD_NOT_BE_RELIABLY_ASSESSED" }),
                    study("LOW_INTENSITY", { RESISTANCE_INTENSITY: "LOW_INTENSITY" }),
                    study("MODERATE_TO_HIGH_INTENSITY", { RESISTANCE_INTENSITY: "MODERATE_TO_HIGH_INTENSITY" }),
                    study("MODERATE_INTENSITY", { RESISTANCE_INTENSITY: "MODERATE_INTENSITY" }),
                    study("HIGH_INTENSITY", { RESISTANCE_INTENSITY: "HIGH_INTENSITY" }),
                ];

                expect(selectedCode(group, mapType)).toBe("HIGH_INTENSITY");
                expect(selectedCode(group.slice(0, 5), mapType)).toBe("MODERATE_INTENSITY");
                expect(selectedCode(group.slice(0, 4), mapType)).toBe("MODERATE_TO_HIGH_INTENSITY");
                expect(selectedCode(group.slice(0, 3), mapType)).toBe("LOW_INTENSITY");
            });

            it("ties NA and not assessed, so the first one of the group wins", () => {
                const notAssessed = study("notAssessed", { RESISTANCE_INTENSITY: "COULD_NOT_BE_RELIABLY_ASSESSED" });
                const na = study("na", { RESISTANCE_INTENSITY: "NA" });

                expect(selectedCode([notAssessed, na], mapType)).toBe("notAssessed");
                expect(selectedCode([na, notAssessed], mapType)).toBe("na");
            });

            it("returns the study itself, without a priority", () => {
                const high = study("high", { RESISTANCE_INTENSITY: "HIGH_INTENSITY" });

                expect(studySelector([high], mapType)).toBe(high);
            });
        });

        describe("Resistance mechanisms", () => {
            const mapType = PreventionMapType.RESISTANCE_MECHANISM;

            it("picks the most recent year before the status", () => {
                const group = [
                    study("older", { YEAR_START: 2019, MECHANISM_STATUS: "DETECTED" }),
                    study("recent", { YEAR_START: 2020, MECHANISM_STATUS: "NOT_DETECTED" }),
                ];

                expect(selectedCode(group, mapType)).toBe("recent");
            });

            it("puts detected before not detected and NA", () => {
                const group = ["NA", "NOT_DETECTED", "DETECTED"].map(status =>
                    study(status, { MECHANISM_STATUS: status })
                );

                expect(selectedCode(group, mapType)).toBe("DETECTED");
            });

            it("ties not detected, NA and an unknown status, so the first one of the group wins (finding)", () => {
                const group = ["UNKNOWN", "NOT_DETECTED", "NA"].map(status =>
                    study(status, { MECHANISM_STATUS: status })
                );

                expect(selectedCode(group, mapType)).toBe("UNKNOWN");
                expect(selectedCode([...group].reverse(), mapType)).toBe("NA");
            });
        });

        describe("Level of involvement", () => {
            const mapType = PreventionMapType.LEVEL_OF_INVOLVEMENT;

            it("picks the most recent year before the involvement", () => {
                const group = [
                    study("older", { YEAR_START: 2019, MECHANISM_PROXY: "FULL_INVOLVEMENT" }),
                    study("recent", { YEAR_START: 2020, MECHANISM_PROXY: "NO_INVOLVEMENT" }),
                ];

                expect(selectedCode(group, mapType)).toBe("recent");
            });

            it("orders full, partial, and then no involvement and not assessed", () => {
                const group = [
                    study("COULD_NOT_BE_RELIABLY_ASSESSED", { MECHANISM_PROXY: "COULD_NOT_BE_RELIABLY_ASSESSED" }),
                    study("NO_INVOLVEMENT", { MECHANISM_PROXY: "NO_INVOLVEMENT" }),
                    study("PARTIAL_INVOLVEMENT", { MECHANISM_PROXY: "PARTIAL_INVOLVEMENT" }),
                    study("FULL_INVOLVEMENT", { MECHANISM_PROXY: "FULL_INVOLVEMENT" }),
                ];

                expect(selectedCode(group, mapType)).toBe("FULL_INVOLVEMENT");
                expect(selectedCode(group.slice(0, 3), mapType)).toBe("PARTIAL_INVOLVEMENT");
                expect(selectedCode(group.slice(0, 2), mapType)).toBe("COULD_NOT_BE_RELIABLY_ASSESSED");
            });

            it("ties an unknown involvement with no involvement, so the first one of the group wins (finding)", () => {
                const unknown = study("unknown", { MECHANISM_PROXY: "NA" });
                const none = study("none", { MECHANISM_PROXY: "NO_INVOLVEMENT" });

                expect(selectedCode([unknown, none], mapType)).toBe("unknown");
                expect(selectedCode([none, unknown], mapType)).toBe("none");
            });
        });

        describe.each([
            PreventionMapType.RESISTANCE_STATUS,
            PreventionMapType.INTENSITY_STATUS,
            PreventionMapType.RESISTANCE_MECHANISM,
            PreventionMapType.LEVEL_OF_INVOLVEMENT,
        ])("map type %s with an empty group", mapType => {
            it("returns undefined, since the year filter never reads the missing first study", () => {
                expect(studySelector([], mapType)).toBe(undefined);
            });
        });

        it("returns the first study of the group for an unknown map type", () => {
            const group = [study("first", { YEAR_START: 2019 }), study("second", { YEAR_START: 2020 })];

            expect(selectedCode(group, 99)).toBe("first");
        });
    });

    describe("getMostPriorityUsingMortalityAdjusted", () => {
        it("picks the highest adjusted mortality", () => {
            const group = ["0.5", "0.97", "0.8"].map(value => study(value, { MORTALITY_ADJUSTED: value }));

            expect(getMostPriorityUsingMortalityAdjusted(group).Code).toBe("0.97");
        });

        it("picks a non-numeric value before any number, since it sorts as -Infinity (finding)", () => {
            const group = ["0.97", "NA", "0.5"].map(value => study(value, { MORTALITY_ADJUSTED: value }));

            expect(getMostPriorityUsingMortalityAdjusted(group).Code).toBe("NA");
        });

        it("returns undefined for an empty list", () => {
            expect(getMostPriorityUsingMortalityAdjusted([])).toBe(undefined);
        });
    });

    describe("getMostPriorityStudiesUsingMechanismProxy", () => {
        it("returns every study with the top involvement, in their order", () => {
            const group = [
                study("partial", { MECHANISM_PROXY: "PARTIAL_INVOLVEMENT" }),
                study("full1", { MECHANISM_PROXY: "FULL_INVOLVEMENT" }),
                study("full2", { MECHANISM_PROXY: "FULL_INVOLVEMENT" }),
            ];

            expect(codes(getMostPriorityStudiesUsingMechanismProxy(group))).toEqual(["full1", "full2"]);
        });

        it("does not look at the year", () => {
            const group = [
                study("recent", { YEAR_START: 2020, MECHANISM_PROXY: "NO_INVOLVEMENT" }),
                study("older", { YEAR_START: 2015, MECHANISM_PROXY: "PARTIAL_INVOLVEMENT" }),
            ];

            expect(codes(getMostPriorityStudiesUsingMechanismProxy(group))).toEqual(["older"]);
        });

        it("returns an empty list for an empty list", () => {
            expect(getMostPriorityStudiesUsingMechanismProxy([])).toEqual([]);
        });

        it("keeps only the first proxy among tied unknown and no involvement (finding)", () => {
            const group = [
                study("unknown", { MECHANISM_PROXY: "NA" }),
                study("none", { MECHANISM_PROXY: "NO_INVOLVEMENT" }),
            ];

            expect(codes(getMostPriorityStudiesUsingMechanismProxy(group))).toEqual(["unknown"]);
        });
    });

    describe("getByMostRecentYearAndInvolvement", () => {
        it("picks the top involvement within the most recent year", () => {
            const group = [
                study("olderFull", { YEAR_START: 2019, MECHANISM_PROXY: "FULL_INVOLVEMENT" }),
                study("recentNone", { YEAR_START: 2020, MECHANISM_PROXY: "NO_INVOLVEMENT" }),
                study("recentPartial", { YEAR_START: 2020, MECHANISM_PROXY: "PARTIAL_INVOLVEMENT" }),
            ];

            expect(getByMostRecentYearAndInvolvement(group).Code).toBe("recentPartial");
        });

        it("returns undefined for an empty group", () => {
            expect(getByMostRecentYearAndInvolvement([])).toBe(undefined);
        });
    });
});
