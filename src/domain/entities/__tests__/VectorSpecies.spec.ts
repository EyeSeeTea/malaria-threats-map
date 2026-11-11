import { createInvasiveStudy } from "../__fixtures__/studyFixtures";
import { STEPHENSI_MYSORENSIS, NOT_REPORTED, STEPHENSI_TYPE_FORM } from "../__fixtures__/studyValues";
import { getVectorSpecies } from "../VectorSpecies";

const studiesOf = (species: ReadonlyArray<string | null | undefined>) =>
    species.map(VECTOR_SPECIES => createInvasiveStudy({ VECTOR_SPECIES }));

describe("VectorSpecies", () => {
    describe("getVectorSpecies", () => {
        it("returns each species once, in the order it first appears", () => {
            expect(
                getVectorSpecies(studiesOf([STEPHENSI_MYSORENSIS, STEPHENSI_TYPE_FORM, STEPHENSI_MYSORENSIS]))
            ).toEqual([STEPHENSI_MYSORENSIS, STEPHENSI_TYPE_FORM]);
        });

        it("keeps NR, which is a value of the data", () => {
            expect(getVectorSpecies(studiesOf([STEPHENSI_TYPE_FORM, NOT_REPORTED]))).toEqual([
                STEPHENSI_TYPE_FORM,
                NOT_REPORTED,
            ]);
        });

        it("leaves out empty and missing species", () => {
            expect(getVectorSpecies(studiesOf([STEPHENSI_TYPE_FORM, "", null, undefined]))).toEqual([
                STEPHENSI_TYPE_FORM,
            ]);
        });

        it("returns an empty list for no studies", () => {
            expect(getVectorSpecies([])).toEqual([]);
        });
    });
});
