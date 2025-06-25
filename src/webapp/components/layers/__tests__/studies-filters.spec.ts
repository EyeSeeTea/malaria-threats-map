import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { filterByOnlyIncludeBioassaysWithMoreMosquitoes } from "../studies-filters";

describe("studies-filters", () => {
    describe("filterByOnlyIncludeBioassaysWithMoreMosquitoes", () => {
        const runTestCases = (testCases: [number, string][], expectedResult: boolean) => {
            testCases.forEach(([filter, stringValue]) => {
                const result = filterByOnlyIncludeBioassaysWithMoreMosquitoes(filter)({
                    NUMBER: stringValue,
                } as PreventionStudy);
                expect(result).toEqual(expectedResult);
            });
        };

        it("should return true if the filter is 0, regardless the study NUMBER", () => {
            const cases: [number, string][] = [
                [0, "100"],
                [0, "bad value"],
                [0, "1+"],
                [0, "1-1000"],
                [0, "NA"],
                [0, "-1"],
                [0, "0"],
            ];
            runTestCases(cases, true);
        });

        it("should return true if the NUMBER is equal", () => {
            const cases: [number, string][] = [
                [100, "100"],
                [100, "100.0"],
                [0, "0"],
                [1, "1"],
                [500, "500"],
            ];
            runTestCases(cases, true);
        });
        it("should return false if the NUMBER is lesser", () => {
            const cases: [number, string][] = [
                [100, "99"],
                [100, "0"],
                [1, "0"],
                [2, "1"],
                [500, "10"],
            ];
            runTestCases(cases, false);
        });
        it("should return true if the NUMBER is greater", () => {
            const cases: [number, string][] = [
                [100, "101"],
                [100, "1000"],
                [1, "999"],
                [2, "3"],
                [500, "501"],
            ];
            runTestCases(cases, true);
        });
        it("should return true if NUMBER is 'NA', 'NR', '-', '.'", () => {
            const cases: [number, string][] = [
                [100, "NA"],
                [100, "NR"],
                [100, "-"],
                [100, "."],
                [0, "NR"],
            ];
            runTestCases(cases, true);
        });
        it("It should allow ranges 'N-M', use the upper bound as the target number", () => {
            const cases: [number, string][] = [
                [100, "90-110"],
                [100, "99-100"],
                [100, "0-100"],
                [100, "80-101"],
                [0, "100-120"],
                [0, "0-10"],
            ];
            runTestCases(cases, true);
            const falseCases: [number, string][] = [
                [100, "90-99"],
                [100, "10-20"],
                [2, "0-1"],
            ];
            runTestCases(falseCases, false);
        });
        it("It should allow approximate values '~N', use the number as the target number", () => {
            const cases: [number, string][] = [
                [100, "~100"],
                [100, "~101"],
                [100, "~200"],
                [0, "~1"],
                [0, "~20"],
            ];
            runTestCases(cases, true);
            const falseCases: [number, string][] = [
                [100, "~99"],
                [100, "~10"],
                [2, "~1"],
            ];
            runTestCases(falseCases, false);
        });
        it("It should max values 'N max', use the number as the target number", () => {
            const cases: [number, string][] = [
                [100, "100 max"],
                [100, "101 max"],
                [100, "200 max"],
                [0, "1 max"],
                [0, "20 max"],
            ];
            runTestCases(cases, true);
            const falseCases: [number, string][] = [
                [100, "99 max"],
                [100, "10 max"],
                [2, "1 max"],
            ];
            runTestCases(falseCases, false);
        });
        it("It should max values 'N+', always return true", () => {
            const cases: [number, string][] = [
                [100, "100+"],
                [100, "99+"],
                [100, "0+"],
                [0, "0+"],
                [0, "20+"],
                [2, "1+"],
            ];
            runTestCases(cases, true);
        });
    });
});
