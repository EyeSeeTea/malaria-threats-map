import { createPreventionStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { PreventionMapType } from "../../../../store/types";
import {
    getMostPriorityStudiesUsingMechanismProxy,
    getMostPriorityUsingMortalityAdjusted,
    studySelector,
} from "../utils";
import { NOT_AVAILABLE } from "../../../../../domain/entities/__fixtures__/studyValues";

const OLDER = "older";
const RECENT = "recent";
const CONFIRMED_RESISTANCE = "CONFIRMED_RESISTANCE";
const SUSCEPTIBLE = "SUSCEPTIBLE";
const UNDETERMINED = "UNDETERMINED";
const POSSIBLE_RESISTANCE = "POSSIBLE_RESISTANCE";
const CONFIRMED_STUDY = "confirmed";
const FIRST = "first";
const SECOND = "second";
const UNKNOWN_STUDY = "unknown";
const HIGH_INTENSITY = "HIGH_INTENSITY";
const LOW_INTENSITY = "LOW_INTENSITY";
const NOT_ASSESSED = "COULD_NOT_BE_RELIABLY_ASSESSED";
const MODERATE_TO_HIGH_INTENSITY = "MODERATE_TO_HIGH_INTENSITY";
const MODERATE_INTENSITY = "MODERATE_INTENSITY";
const NOT_ASSESSED_STUDY = "notAssessed";
const NA_STUDY = "na";
const DETECTED = "DETECTED";
const NOT_DETECTED = "NOT_DETECTED";
const UNKNOWN_STATUS = "UNKNOWN";
const FULL_INVOLVEMENT = "FULL_INVOLVEMENT";
const NO_INVOLVEMENT = "NO_INVOLVEMENT";
const PARTIAL_INVOLVEMENT = "PARTIAL_INVOLVEMENT";
const NONE_STUDY = "none";
const LOW_MORTALITY = "0.5";
const HIGH_MORTALITY = "0.97";
const FIRST_FULL = "full1";
const SECOND_FULL = "full2";

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
                    study(OLDER, { YEAR_START: 2019, RESISTANCE_STATUS: CONFIRMED_RESISTANCE }),
                    study(RECENT, { YEAR_START: 2020, RESISTANCE_STATUS: SUSCEPTIBLE }),
                ];

                expect(selectedCode(group, mapType)).toBe(RECENT);
            });

            it("orders the statuses confirmed, possible, susceptible, undetermined", () => {
                const statuses = [UNDETERMINED, SUSCEPTIBLE, POSSIBLE_RESISTANCE, CONFIRMED_RESISTANCE];
                const group = statuses.map(status => study(status, { RESISTANCE_STATUS: status }));

                expect(selectedCode(group, mapType)).toBe(CONFIRMED_RESISTANCE);
                expect(selectedCode(group.slice(0, 3), mapType)).toBe(POSSIBLE_RESISTANCE);
                expect(selectedCode(group.slice(0, 2), mapType)).toBe(SUSCEPTIBLE);
                expect(selectedCode(group.slice(0, 1), mapType)).toBe(UNDETERMINED);
            });

            it("keeps the first study of the group on a tie", () => {
                const group = [
                    study(FIRST, { RESISTANCE_STATUS: POSSIBLE_RESISTANCE }),
                    study(SECOND, { RESISTANCE_STATUS: POSSIBLE_RESISTANCE }),
                ];

                expect(selectedCode(group, mapType)).toBe(FIRST);
            });

            // Pins today's behaviour, a possible bug pending a decision: a status missing from the record
            // ties with every status, so the order of the studies decides, even over confirmed resistance.
            it("lets the input order decide for a status missing from the record", () => {
                const unknown = study(UNKNOWN_STUDY, { RESISTANCE_STATUS: NOT_AVAILABLE });
                const confirmed = study(CONFIRMED_STUDY, { RESISTANCE_STATUS: CONFIRMED_RESISTANCE });

                expect(selectedCode([unknown, confirmed], mapType)).toBe(UNKNOWN_STUDY);
                expect(selectedCode([confirmed, unknown], mapType)).toBe(CONFIRMED_STUDY);
            });
        });

        describe("Intensity status", () => {
            const mapType = PreventionMapType.INTENSITY_STATUS;

            it("picks the most recent year before the intensity", () => {
                const group = [
                    study(OLDER, { YEAR_START: 2019, RESISTANCE_INTENSITY: HIGH_INTENSITY }),
                    study(RECENT, { YEAR_START: 2020, RESISTANCE_INTENSITY: LOW_INTENSITY }),
                ];

                expect(selectedCode(group, mapType)).toBe(RECENT);
            });

            // Moderate ranks above moderate to high on purpose: the order was changed so in June 2024.
            it("orders high, moderate, moderate to high, low, and then NA and not assessed", () => {
                const group = [
                    study(NOT_AVAILABLE, { RESISTANCE_INTENSITY: NOT_AVAILABLE }),
                    study(NOT_ASSESSED, { RESISTANCE_INTENSITY: NOT_ASSESSED }),
                    study(LOW_INTENSITY, { RESISTANCE_INTENSITY: LOW_INTENSITY }),
                    study(MODERATE_TO_HIGH_INTENSITY, { RESISTANCE_INTENSITY: MODERATE_TO_HIGH_INTENSITY }),
                    study(MODERATE_INTENSITY, { RESISTANCE_INTENSITY: MODERATE_INTENSITY }),
                    study(HIGH_INTENSITY, { RESISTANCE_INTENSITY: HIGH_INTENSITY }),
                ];

                expect(selectedCode(group, mapType)).toBe(HIGH_INTENSITY);
                expect(selectedCode(group.slice(0, 5), mapType)).toBe(MODERATE_INTENSITY);
                expect(selectedCode(group.slice(0, 4), mapType)).toBe(MODERATE_TO_HIGH_INTENSITY);
                expect(selectedCode(group.slice(0, 3), mapType)).toBe(LOW_INTENSITY);
            });

            it("ties NA and not assessed, so the first one of the group wins", () => {
                const notAssessed = study(NOT_ASSESSED_STUDY, { RESISTANCE_INTENSITY: NOT_ASSESSED });
                const na = study(NA_STUDY, { RESISTANCE_INTENSITY: NOT_AVAILABLE });

                expect(selectedCode([notAssessed, na], mapType)).toBe(NOT_ASSESSED_STUDY);
                expect(selectedCode([na, notAssessed], mapType)).toBe(NA_STUDY);
            });
        });

        describe("Resistance mechanisms", () => {
            const mapType = PreventionMapType.RESISTANCE_MECHANISM;

            it("picks the most recent year before the status", () => {
                const group = [
                    study(OLDER, { YEAR_START: 2019, MECHANISM_STATUS: DETECTED }),
                    study(RECENT, { YEAR_START: 2020, MECHANISM_STATUS: NOT_DETECTED }),
                ];

                expect(selectedCode(group, mapType)).toBe(RECENT);
            });

            it("puts detected before not detected and NA", () => {
                const group = [NOT_AVAILABLE, NOT_DETECTED, DETECTED].map(status =>
                    study(status, { MECHANISM_STATUS: status })
                );

                expect(selectedCode(group, mapType)).toBe(DETECTED);
            });

            // Pins today's behaviour, a possible bug pending a decision: a status missing from the record
            // ties with the lowest one, so the order of the studies decides.
            it("ties not detected, NA and an unknown status, so the first one of the group wins", () => {
                const group = [UNKNOWN_STATUS, NOT_DETECTED, NOT_AVAILABLE].map(status =>
                    study(status, { MECHANISM_STATUS: status })
                );

                expect(selectedCode(group, mapType)).toBe(UNKNOWN_STATUS);
                expect(selectedCode([...group].reverse(), mapType)).toBe(NOT_AVAILABLE);
            });
        });

        describe("Level of involvement", () => {
            const mapType = PreventionMapType.LEVEL_OF_INVOLVEMENT;

            it("picks the most recent year before the involvement", () => {
                const group = [
                    study(OLDER, { YEAR_START: 2019, MECHANISM_PROXY: FULL_INVOLVEMENT }),
                    study(RECENT, { YEAR_START: 2020, MECHANISM_PROXY: NO_INVOLVEMENT }),
                ];

                expect(selectedCode(group, mapType)).toBe(RECENT);
            });

            it("orders full, partial, and then no involvement and not assessed", () => {
                const group = [
                    study(NOT_ASSESSED, { MECHANISM_PROXY: NOT_ASSESSED }),
                    study(NO_INVOLVEMENT, { MECHANISM_PROXY: NO_INVOLVEMENT }),
                    study(PARTIAL_INVOLVEMENT, { MECHANISM_PROXY: PARTIAL_INVOLVEMENT }),
                    study(FULL_INVOLVEMENT, { MECHANISM_PROXY: FULL_INVOLVEMENT }),
                ];

                expect(selectedCode(group, mapType)).toBe(FULL_INVOLVEMENT);
                expect(selectedCode(group.slice(0, 3), mapType)).toBe(PARTIAL_INVOLVEMENT);
                expect(selectedCode(group.slice(0, 2), mapType)).toBe(NOT_ASSESSED);
            });

            // Pins today's behaviour, a possible bug pending a decision: a study without a level of
            // involvement ties with no involvement, so the order of the studies decides the colour.
            it("ties an unknown involvement with no involvement, so the first one of the group wins", () => {
                const unknown = study(UNKNOWN_STUDY, { MECHANISM_PROXY: NOT_AVAILABLE });
                const none = study(NONE_STUDY, { MECHANISM_PROXY: NO_INVOLVEMENT });

                expect(selectedCode([unknown, none], mapType)).toBe(UNKNOWN_STUDY);
                expect(selectedCode([none, unknown], mapType)).toBe(NONE_STUDY);
            });
        });
    });

    describe("getMostPriorityUsingMortalityAdjusted", () => {
        it("picks the highest adjusted mortality", () => {
            const group = [LOW_MORTALITY, HIGH_MORTALITY, "0.8"].map(value =>
                study(value, { MORTALITY_ADJUSTED: value })
            );

            expect(getMostPriorityUsingMortalityAdjusted(group).Code).toBe(HIGH_MORTALITY);
        });

        // Pins today's behaviour, a possible bug pending a decision: the intensity chart picks a
        // non-numeric mortality before any number.
        it("picks a non-numeric value before any number, since it sorts as -Infinity", () => {
            const group = [HIGH_MORTALITY, NOT_AVAILABLE, LOW_MORTALITY].map(value =>
                study(value, { MORTALITY_ADJUSTED: value })
            );

            expect(getMostPriorityUsingMortalityAdjusted(group).Code).toBe(NOT_AVAILABLE);
        });
    });

    describe("getMostPriorityStudiesUsingMechanismProxy", () => {
        it("returns every study with the top involvement, in their order", () => {
            const group = [
                study("partial", { MECHANISM_PROXY: PARTIAL_INVOLVEMENT }),
                study(FIRST_FULL, { MECHANISM_PROXY: FULL_INVOLVEMENT }),
                study(SECOND_FULL, { MECHANISM_PROXY: FULL_INVOLVEMENT }),
            ];

            expect(codes(getMostPriorityStudiesUsingMechanismProxy(group))).toEqual([FIRST_FULL, SECOND_FULL]);
        });

        it("does not look at the year", () => {
            const group = [
                study(RECENT, { YEAR_START: 2020, MECHANISM_PROXY: NO_INVOLVEMENT }),
                study(OLDER, { YEAR_START: 2015, MECHANISM_PROXY: PARTIAL_INVOLVEMENT }),
            ];

            expect(codes(getMostPriorityStudiesUsingMechanismProxy(group))).toEqual([OLDER]);
        });

        // Pins today's behaviour, a possible bug pending a decision: a study without a level of
        // involvement ties with no involvement, so the side panel keeps only the first one's studies.
        it("keeps only the first proxy among tied unknown and no involvement", () => {
            const group = [
                study(UNKNOWN_STUDY, { MECHANISM_PROXY: NOT_AVAILABLE }),
                study(NONE_STUDY, { MECHANISM_PROXY: NO_INVOLVEMENT }),
            ];

            expect(codes(getMostPriorityStudiesUsingMechanismProxy(group))).toEqual([UNKNOWN_STUDY]);
        });
    });
});
