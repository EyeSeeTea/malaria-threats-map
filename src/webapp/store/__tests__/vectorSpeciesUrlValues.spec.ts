import {
    STEPHENSI_INTERMEDIATE_FORM,
    STEPHENSI_MYSORENSIS,
    STEPHENSI_NOT_FOUND,
    NOT_REPORTED,
    STEPHENSI_TYPE_FORM,
    STEPHENSI_TYPE_FORM_KEY,
    STEPHENSI_MYSORENSIS_KEY,
    STEPHENSI_INTERMEDIATE_FORM_KEY,
    STEPHENSI_FORM_UNSPECIFIED_KEY,
    STEPHENSI_NOT_FOUND_KEY,
} from "../../../domain/entities/__fixtures__/studyValues";
import { toVectorSpeciesValues } from "../vectorSpeciesUrlValues";

describe("vectorSpeciesUrlValues", () => {
    describe("toVectorSpeciesValues", () => {
        it("turns each old code into its data value", () => {
            const oldCodes = [
                STEPHENSI_TYPE_FORM_KEY,
                STEPHENSI_MYSORENSIS_KEY,
                STEPHENSI_INTERMEDIATE_FORM_KEY,
                STEPHENSI_FORM_UNSPECIFIED_KEY,
                STEPHENSI_NOT_FOUND_KEY,
            ];

            expect(toVectorSpeciesValues(oldCodes)).toEqual([
                STEPHENSI_TYPE_FORM,
                STEPHENSI_MYSORENSIS,
                STEPHENSI_INTERMEDIATE_FORM,
                NOT_REPORTED,
                STEPHENSI_NOT_FOUND,
            ]);
        });

        it("leaves a data value as it is", () => {
            expect(toVectorSpeciesValues([STEPHENSI_TYPE_FORM, NOT_REPORTED])).toEqual([
                STEPHENSI_TYPE_FORM,
                NOT_REPORTED,
            ]);
        });
    });
});
