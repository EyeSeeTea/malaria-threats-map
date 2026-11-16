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
import {
    addVectorSpeciesAppLabels,
    NOT_REPORTED_APP_LABEL,
    removeEnglishResources,
    STEPHENSI_MYSORENSIS_APP_LABEL,
} from "../../../types/__fixtures__/translationFixtures";
import { getVectorSpeciesLabel, getVectorSpeciesOptions } from "../VectorSpeciesFilter";

const XMART_TYPE_FORM_LABEL = "Type form (xMART)";

// The xMART translations arrive as flat FIELD.VALUE keys (see DataProvider), the app's as nested JSON.
const xmartTranslations = { [`VECTOR_SPECIES.${STEPHENSI_TYPE_FORM}`]: XMART_TYPE_FORM_LABEL };

describe("VectorSpeciesFilter", () => {
    beforeAll(() => {
        addVectorSpeciesAppLabels();
        i18next.addResourceBundle("en", "translation", xmartTranslations);
    });

    afterAll(() => {
        removeEnglishResources();
    });

    describe("getVectorSpeciesLabel", () => {
        it("uses the xMART translation first", () => {
            expect(getVectorSpeciesLabel(STEPHENSI_TYPE_FORM)).toBe(XMART_TYPE_FORM_LABEL);
        });

        it("falls back to the app's translation, whose key has dots", () => {
            expect(getVectorSpeciesLabel(STEPHENSI_MYSORENSIS)).toBe(STEPHENSI_MYSORENSIS_APP_LABEL);
        });

        it("shows the value itself when neither has it", () => {
            expect(getVectorSpeciesLabel(STEPHENSI)).toBe(STEPHENSI);
        });
    });

    describe("getVectorSpeciesOptions", () => {
        const studiesOf = (species: ReadonlyArray<string>) =>
            species.map(VECTOR_SPECIES => createInvasiveStudy({ VECTOR_SPECIES }));

        it("on the map, offers each species of the studies once, with its label", () => {
            const studies = studiesOf([STEPHENSI_MYSORENSIS, STEPHENSI, NOT_REPORTED, STEPHENSI_MYSORENSIS]);

            expect(getVectorSpeciesOptions(studies, "map")).toEqual([
                { label: STEPHENSI_MYSORENSIS_APP_LABEL, value: STEPHENSI_MYSORENSIS },
                { label: STEPHENSI, value: STEPHENSI },
                { label: NOT_REPORTED_APP_LABEL, value: NOT_REPORTED },
            ]);
        });

        // Data Download is out of scope: it keeps the 5 species it offered before they came from the data.
        it("on Data Download, offers today's 5 species, not An. stephensi from the studies", () => {
            expect(getVectorSpeciesOptions(studiesOf([STEPHENSI, STEPHENSI_MYSORENSIS]), "download")).toEqual([
                { label: XMART_TYPE_FORM_LABEL, value: STEPHENSI_TYPE_FORM },
                { label: STEPHENSI_MYSORENSIS_APP_LABEL, value: STEPHENSI_MYSORENSIS },
                { label: STEPHENSI_INTERMEDIATE_FORM, value: STEPHENSI_INTERMEDIATE_FORM },
                { label: NOT_REPORTED_APP_LABEL, value: NOT_REPORTED },
                { label: STEPHENSI_NOT_FOUND, value: STEPHENSI_NOT_FOUND },
            ]);
        });
    });
});
