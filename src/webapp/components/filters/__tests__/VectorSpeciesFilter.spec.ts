import i18next from "i18next";
import { createInvasiveStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import { MYSORENSIS, NOT_REPORTED, STEPHENSI, TYPE_FORM } from "../../../../domain/entities/__fixtures__/studyValues";
import { getVectorSpeciesLabel, getVectorSpeciesOptions } from "../VectorSpeciesFilter";

const XMART_TYPE_FORM_LABEL = "Type form (xMART)";
const APP_TYPE_FORM_LABEL = "Type form (app)";
const APP_MYSORENSIS_LABEL = "Mysorensis (app)";
const APP_NOT_REPORTED_LABEL = "Form unspecified (app)";

// The xMART translations arrive as flat FIELD.VALUE keys (see DataProvider), the app's as nested JSON.
const xmartTranslations = { [`VECTOR_SPECIES.${TYPE_FORM}`]: XMART_TYPE_FORM_LABEL };
const appTranslations = {
    common: {
        filters: {
            vector_species_options: {
                [TYPE_FORM]: APP_TYPE_FORM_LABEL,
                [MYSORENSIS]: APP_MYSORENSIS_LABEL,
                [NOT_REPORTED]: APP_NOT_REPORTED_LABEL,
            },
        },
    },
};

beforeAll(() => {
    i18next.addResourceBundle("en", "translation", appTranslations, true, true);
    i18next.addResourceBundle("en", "translation", xmartTranslations);
});

afterAll(() => {
    i18next.removeResourceBundle("en", "translation");
});

describe("VectorSpeciesFilter", () => {
    describe("getVectorSpeciesLabel", () => {
        it("uses the xMART translation first", () => {
            expect(getVectorSpeciesLabel(TYPE_FORM)).toBe(XMART_TYPE_FORM_LABEL);
        });

        it("falls back to the app's translation, whose key has dots", () => {
            expect(getVectorSpeciesLabel(MYSORENSIS)).toBe(APP_MYSORENSIS_LABEL);
        });

        it("shows the value itself when neither has it", () => {
            expect(getVectorSpeciesLabel(STEPHENSI)).toBe(STEPHENSI);
        });
    });

    describe("getVectorSpeciesOptions", () => {
        it("offers each species of the studies once, with its label", () => {
            const studies = [MYSORENSIS, STEPHENSI, NOT_REPORTED, MYSORENSIS].map(VECTOR_SPECIES =>
                createInvasiveStudy({ VECTOR_SPECIES })
            );

            expect(getVectorSpeciesOptions(studies)).toEqual([
                { label: APP_MYSORENSIS_LABEL, value: MYSORENSIS },
                { label: STEPHENSI, value: STEPHENSI },
                { label: APP_NOT_REPORTED_LABEL, value: NOT_REPORTED },
            ]);
        });

        it("offers nothing without studies", () => {
            expect(getVectorSpeciesOptions([])).toEqual([]);
        });
    });
});
