import { createInvasiveStudy } from "../__fixtures__/studyFixtures";
import { NOT_REPORTED } from "../__fixtures__/studyValues";
import { getVectorSpecies } from "../VectorSpecies";

const TYPE_FORM = "An. stephensi type form";
const MYSORENSIS = "An. stephensi mysorensis";

const studiesOf = (species: ReadonlyArray<string | null | undefined>) =>
    species.map(VECTOR_SPECIES => createInvasiveStudy({ VECTOR_SPECIES }));

describe("VectorSpecies", () => {
    describe("getVectorSpecies", () => {
        it("returns each species once, in the order it first appears", () => {
            expect(getVectorSpecies(studiesOf([MYSORENSIS, TYPE_FORM, MYSORENSIS]))).toEqual([MYSORENSIS, TYPE_FORM]);
        });

        it("keeps NR, which is a value of the data", () => {
            expect(getVectorSpecies(studiesOf([TYPE_FORM, NOT_REPORTED]))).toEqual([TYPE_FORM, NOT_REPORTED]);
        });

        it("leaves out empty and missing species", () => {
            expect(getVectorSpecies(studiesOf([TYPE_FORM, "", null, undefined]))).toEqual([TYPE_FORM]);
        });

        it("returns an empty list for no studies", () => {
            expect(getVectorSpecies([])).toEqual([]);
        });
    });
});
