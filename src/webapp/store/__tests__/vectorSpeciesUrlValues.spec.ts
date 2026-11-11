import {
    INTERMEDIATE_FORM,
    MYSORENSIS,
    NOT_FOUND,
    NOT_REPORTED,
    TYPE_FORM,
} from "../../../domain/entities/__fixtures__/studyValues";
import { TYPE_FORM_KEY } from "../__fixtures__/vectorSpeciesUrlKeys";
import { toVectorSpeciesValues } from "../vectorSpeciesUrlValues";

describe("vectorSpeciesUrlValues", () => {
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
                MYSORENSIS,
                INTERMEDIATE_FORM,
                NOT_REPORTED,
                NOT_FOUND,
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
