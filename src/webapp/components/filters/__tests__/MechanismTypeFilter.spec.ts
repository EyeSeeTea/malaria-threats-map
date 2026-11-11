import { cleanMechanismTypeOptions, WHITELISTED_TYPES } from "../MechanismTypeFilter";
import {
    ACE1R,
    ESTERASES,
    GSTS,
    KDR_L1014F,
    KDR_L1014S,
    KDR_UNSPECIFIED,
    MONO_OXYGENASES,
    NOT_AVAILABLE,
    WHO_TEST_KIT,
} from "../../../../domain/entities/__fixtures__/studyValues";

describe("cleanMechanismTypeOptions", () => {
    it("pins the whitelist and its order", () => {
        expect(WHITELISTED_TYPES).toEqual([
            MONO_OXYGENASES,
            ESTERASES,
            GSTS,
            KDR_L1014S,
            KDR_L1014F,
            KDR_UNSPECIFIED,
            ACE1R,
        ]);
    });

    it("returns the values in the order of the whitelist, not of the input", () => {
        expect(cleanMechanismTypeOptions([ACE1R, GSTS, MONO_OXYGENASES, KDR_L1014F])).toEqual([
            MONO_OXYGENASES,
            GSTS,
            KDR_L1014F,
            ACE1R,
        ]);
    });

    it("drops the values outside the whitelist, NA included", () => {
        expect(cleanMechanismTypeOptions([ESTERASES, WHO_TEST_KIT, NOT_AVAILABLE, KDR_L1014S])).toEqual([
            ESTERASES,
            KDR_L1014S,
        ]);
    });

    it("returns each value once when the input repeats it", () => {
        expect(cleanMechanismTypeOptions([GSTS, GSTS, ESTERASES, GSTS])).toEqual([ESTERASES, GSTS]);
    });

    it("returns an empty list for an empty input", () => {
        expect(cleanMechanismTypeOptions([])).toEqual([]);
    });
});
