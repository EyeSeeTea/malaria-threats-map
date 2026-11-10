import { NOT_REPORTED } from "../../../domain/entities/__fixtures__/studyValues";
import { toVectorSpeciesValues } from "../legacyUrlValues";

const TYPE_FORM = "An. stephensi type form";
const TYPE_FORM_KEY = "AN_STEPHENSI_TYPE_FORM";

describe("legacyUrlValues", () => {
    describe("toVectorSpeciesValues", () => {
        it("turns each old key into its data value", () => {
            const oldKeys = [
                TYPE_FORM_KEY,
                "AN_STEPHENSI_MYSORENSIS",
                "AN_STEPHENSI_INTERMEDIATE_FORM",
                "AN_STEPHENSI_FORM_UNSPECIFIED",
                "AN_STEPHENSI_NOT_FOUND",
            ];

            expect(toVectorSpeciesValues(oldKeys)).toEqual([
                TYPE_FORM,
                "An. stephensi mysorensis",
                "An. stephensi intermediate form",
                NOT_REPORTED,
                "An. stephensi (not found)",
            ]);
        });

        it("leaves a data value as it is", () => {
            expect(toVectorSpeciesValues([TYPE_FORM, NOT_REPORTED])).toEqual([TYPE_FORM, NOT_REPORTED]);
        });

        it("handles a link that mixes old keys and data values", () => {
            expect(toVectorSpeciesValues([TYPE_FORM_KEY, NOT_REPORTED])).toEqual([TYPE_FORM, NOT_REPORTED]);
        });

        it("returns an empty list for no values", () => {
            expect(toVectorSpeciesValues([])).toEqual([]);
        });
    });
});
