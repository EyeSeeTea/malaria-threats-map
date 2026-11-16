import { createInvasiveStudy } from "../../../../domain/entities/__fixtures__/studyFixtures";
import {
    STEPHENSI_MYSORENSIS,
    NOT_REPORTED,
    STEPHENSI,
    STEPHENSI_TYPE_FORM,
    STEPHENSI_INTERMEDIATE_FORM,
    STEPHENSI_NOT_FOUND,
    STEPHENSI_TYPE_FORM_KEY,
    STEPHENSI_MYSORENSIS_KEY,
    STEPHENSI_INTERMEDIATE_FORM_KEY,
    STEPHENSI_FORM_UNSPECIFIED_KEY,
    STEPHENSI_NOT_FOUND_KEY,
} from "../../../../domain/entities/__fixtures__/studyValues";
import {
    addVectorSpeciesAppLabels,
    addXmartLabels,
    NOT_REPORTED_APP_LABEL,
    removeEnglishResources,
    STEPHENSI_MYSORENSIS_APP_LABEL,
} from "../../../types/__fixtures__/translationFixtures";
import {
    getVectorSpeciesAnalyticsLabel,
    getVectorSpeciesLabel,
    getVectorSpeciesOptions,
    keepVectorSpeciesOfferedOnDataDownload,
} from "../VectorSpeciesFilter";

const XMART_TYPE_FORM_LABEL = "Type form (xMART)";

describe("VectorSpeciesFilter", () => {
    beforeAll(() => {
        // The xMART labels arrive as flat FIELD.VALUE keys (see DataProvider), the app's as nested JSON.
        addVectorSpeciesAppLabels();
        addXmartLabels({ [`VECTOR_SPECIES.${STEPHENSI_TYPE_FORM}`]: XMART_TYPE_FORM_LABEL });
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

    // The map and Data Download share the selected species, so a species picked on the map reaches Data Download.
    describe("keepVectorSpeciesOfferedOnDataDownload", () => {
        it("drops a species selected on the map that Data Download does not offer", () => {
            expect(keepVectorSpeciesOfferedOnDataDownload([STEPHENSI, STEPHENSI_TYPE_FORM, NOT_REPORTED])).toEqual([
                STEPHENSI_TYPE_FORM,
                NOT_REPORTED,
            ]);
        });
    });

    describe("getVectorSpeciesAnalyticsLabel", () => {
        it("sends the old code of each of the 5 species analytics received before", () => {
            const species = [
                STEPHENSI_TYPE_FORM,
                STEPHENSI_MYSORENSIS,
                STEPHENSI_INTERMEDIATE_FORM,
                NOT_REPORTED,
                STEPHENSI_NOT_FOUND,
            ];

            expect(species.map(getVectorSpeciesAnalyticsLabel)).toEqual([
                STEPHENSI_TYPE_FORM_KEY,
                STEPHENSI_MYSORENSIS_KEY,
                STEPHENSI_INTERMEDIATE_FORM_KEY,
                STEPHENSI_FORM_UNSPECIFIED_KEY,
                STEPHENSI_NOT_FOUND_KEY,
            ]);
        });

        it("sends the value of a species that had no code", () => {
            expect(getVectorSpeciesAnalyticsLabel(STEPHENSI)).toBe(STEPHENSI);
        });
    });
});
