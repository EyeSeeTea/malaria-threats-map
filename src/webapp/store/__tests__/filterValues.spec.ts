import {
    CARBAMATES,
    DELTAMETHRIN,
    ESTERASES,
    GSTS,
    KDR_L1014S,
    MONO_OXYGENASES,
    ORGANOPHOSPHATES,
    PERMETHRIN,
    PYRETHROIDS,
} from "../../../domain/entities/__fixtures__/studyValues";
import { chooseFilterValue, getSelectedValuesOffered, getValueToSelectInstead } from "../filterValues";

describe("filterValues", () => {
    describe("chooseFilterValue", () => {
        it("keeps the current value when it is offered", () => {
            expect(chooseFilterValue([CARBAMATES, ORGANOPHOSPHATES, PYRETHROIDS], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(
                ORGANOPHOSPHATES
            );
        });

        it("takes the preferred value when the current one is not offered", () => {
            expect(chooseFilterValue([CARBAMATES, PYRETHROIDS], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(PYRETHROIDS);
        });

        it("takes the preferred value when there is no current value", () => {
            expect(chooseFilterValue([CARBAMATES, PYRETHROIDS], PYRETHROIDS)).toBe(PYRETHROIDS);
        });

        it("takes the first option when neither the current nor the preferred value is offered", () => {
            expect(chooseFilterValue([CARBAMATES, ORGANOPHOSPHATES], PYRETHROIDS)).toBe(CARBAMATES);
        });

        it("keeps the current value when nothing is offered, because the studies are not loaded yet", () => {
            expect(chooseFilterValue([], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(ORGANOPHOSPHATES);
        });

        it("takes the preferred value when nothing is offered and there is no current value", () => {
            expect(chooseFilterValue([], PYRETHROIDS)).toBe(PYRETHROIDS);
        });
    });

    // The map and Data Download share the selected values, and the theme change and links set them too,
    // so a filter can receive a value it does not offer.
    describe("getValueToSelectInstead", () => {
        it("keeps a selected value the filter offers", () => {
            expect(getValueToSelectInstead(GSTS, [MONO_OXYGENASES, GSTS], MONO_OXYGENASES)).toBeUndefined();
        });

        it("selects the preferred value instead of one the filter does not offer", () => {
            expect(getValueToSelectInstead(KDR_L1014S, [MONO_OXYGENASES, GSTS], MONO_OXYGENASES)).toBe(MONO_OXYGENASES);
        });

        it("selects the first option when the filter does not offer the preferred value either", () => {
            expect(getValueToSelectInstead(KDR_L1014S, [ESTERASES, GSTS], MONO_OXYGENASES)).toBe(ESTERASES);
        });

        it("changes nothing while the studies load and nothing is offered", () => {
            expect(getValueToSelectInstead(KDR_L1014S, [], MONO_OXYGENASES)).toBeUndefined();
        });

        it("changes nothing without a selected value", () => {
            expect(getValueToSelectInstead(undefined, [MONO_OXYGENASES, GSTS], MONO_OXYGENASES)).toBeUndefined();
        });
    });

    describe("getSelectedValuesOffered", () => {
        it("keeps only the selected values the filter offers", () => {
            expect(getSelectedValuesOffered([DELTAMETHRIN, PERMETHRIN], [PERMETHRIN])).toEqual([PERMETHRIN]);
        });

        it("changes nothing when the filter offers every selected value", () => {
            expect(getSelectedValuesOffered([PERMETHRIN], [DELTAMETHRIN, PERMETHRIN])).toBeUndefined();
        });

        it("changes nothing while the studies load and nothing is offered", () => {
            expect(getSelectedValuesOffered([PERMETHRIN], [])).toBeUndefined();
        });
    });
});
