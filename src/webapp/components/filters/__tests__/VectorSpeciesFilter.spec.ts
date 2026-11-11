import i18next from "i18next";
import { createInvasiveStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import {
    STEPHENSI_MYSORENSIS,
    NOT_REPORTED,
    STEPHENSI,
    STEPHENSI_TYPE_FORM,
    STEPHENSI_INTERMEDIATE_FORM,
    STEPHENSI_NOT_FOUND,
} from "../../../../domain/entities/__fixtures__/studyValues";
import { getVectorSpeciesLabel, getVectorSpeciesOptions } from "../VectorSpeciesFilter";

const XMART_TYPE_FORM_LABEL = "Type form (xMART)";
const APP_TYPE_FORM_LABEL = "Type form (app)";
const APP_MYSORENSIS_LABEL = "Mysorensis (app)";
const APP_NOT_REPORTED_LABEL = "Form unspecified (app)";

// The xMART translations arrive as flat FIELD.VALUE keys (see DataProvider), the app's as nested JSON.
const xmartTranslations = { [`VECTOR_SPECIES.${STEPHENSI_TYPE_FORM}`]: XMART_TYPE_FORM_LABEL };
const appTranslations = {
    common: {
        filters: {
            vector_species_options: {
                [STEPHENSI_TYPE_FORM]: APP_TYPE_FORM_LABEL,
                [STEPHENSI_MYSORENSIS]: APP_MYSORENSIS_LABEL,
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
            expect(getVectorSpeciesLabel(STEPHENSI_TYPE_FORM)).toBe(XMART_TYPE_FORM_LABEL);
        });

        it("falls back to the app's translation, whose key has dots", () => {
            expect(getVectorSpeciesLabel(STEPHENSI_MYSORENSIS)).toBe(APP_MYSORENSIS_LABEL);
        });

        it("shows the value itself when neither has it", () => {
            expect(getVectorSpeciesLabel(STEPHENSI)).toBe(STEPHENSI);
        });
    });

    describe("getVectorSpeciesOptions", () => {
        const studiesOf = (species: ReadonlyArray<string>) =>
            species.map(VECTOR_SPECIES => createInvasiveStudy({ VECTOR_SPECIES }));

        describe("on the map", () => {
            it("offers each species of the studies once, with its label", () => {
                const studies = studiesOf([STEPHENSI_MYSORENSIS, STEPHENSI, NOT_REPORTED, STEPHENSI_MYSORENSIS]);

                expect(getVectorSpeciesOptions(studies, "map")).toEqual([
                    { label: APP_MYSORENSIS_LABEL, value: STEPHENSI_MYSORENSIS },
                    { label: STEPHENSI, value: STEPHENSI },
                    { label: APP_NOT_REPORTED_LABEL, value: NOT_REPORTED },
                ]);
            });

            it("offers nothing without studies", () => {
                expect(getVectorSpeciesOptions([], "map")).toEqual([]);
            });
        });

        // Data Download is out of scope: it keeps the 5 species it offered before they came from the data.
        describe("on Data Download", () => {
            const todaysOptions = [
                { label: XMART_TYPE_FORM_LABEL, value: STEPHENSI_TYPE_FORM },
                { label: APP_MYSORENSIS_LABEL, value: STEPHENSI_MYSORENSIS },
                { label: STEPHENSI_INTERMEDIATE_FORM, value: STEPHENSI_INTERMEDIATE_FORM },
                { label: APP_NOT_REPORTED_LABEL, value: NOT_REPORTED },
                { label: STEPHENSI_NOT_FOUND, value: STEPHENSI_NOT_FOUND },
            ];

            it("offers today's 5 species, not An. stephensi from the studies", () => {
                expect(getVectorSpeciesOptions(studiesOf([STEPHENSI, STEPHENSI_MYSORENSIS]), "download")).toEqual(
                    todaysOptions
                );
            });

            it("offers today's 5 species without studies", () => {
                expect(getVectorSpeciesOptions([], "download")).toEqual(todaysOptions);
            });
        });
    });
});
