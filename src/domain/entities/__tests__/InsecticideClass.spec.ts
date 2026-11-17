import { createPreventionStudy } from "../__fixtures__/studyFixtures";
import {
    CARBAMATES,
    NEONICOTINOIDS,
    NOT_AVAILABLE,
    ORGANOCHLORINES,
    ORGANOPHOSPHATES,
    PYRETHROIDS,
    PYRROLES,
} from "../__fixtures__/studyValues";
import {
    defaultInsecticideClass,
    getAvailableInsecticideClasses,
    getInsecticideClasses,
    sortInsecticideClasses,
} from "../InsecticideClass";

const NEW_CLASS = "FORMAMIDINES";

const todaysOrder = [CARBAMATES, NEONICOTINOIDS, ORGANOCHLORINES, ORGANOPHOSPHATES, PYRETHROIDS, PYRROLES];

describe("InsecticideClass", () => {
    it("selects pyrethroids by default", () => {
        expect(defaultInsecticideClass).toBe(PYRETHROIDS);
    });

    // The map filter, the dashboards and the insecticide type options share this order.
    describe("sortInsecticideClasses", () => {
        it("keeps the order the maps and the dashboards show today, with NA first", () => {
            expect(sortInsecticideClasses([...todaysOrder, NOT_AVAILABLE].reverse())).toEqual([
                NOT_AVAILABLE,
                ...todaysOrder,
            ]);
        });

        it("puts a new class in its alphabetical place", () => {
            expect(sortInsecticideClasses([PYRETHROIDS, NEW_CLASS, CARBAMATES])).toEqual([
                CARBAMATES,
                NEW_CLASS,
                PYRETHROIDS,
            ]);
        });

        it("leaves the given list as it was", () => {
            const classes = [PYRETHROIDS, CARBAMATES];

            sortInsecticideClasses(classes);

            expect(classes).toEqual([PYRETHROIDS, CARBAMATES]);
        });
    });

    describe("getAvailableInsecticideClasses", () => {
        it("leaves out NA and returns the rest in order", () => {
            expect(getAvailableInsecticideClasses([PYRETHROIDS, NOT_AVAILABLE, ORGANOPHOSPHATES])).toEqual([
                ORGANOPHOSPHATES,
                PYRETHROIDS,
            ]);
        });
    });

    describe("getInsecticideClasses", () => {
        it("returns each class the studies carry once, without NA, in order", () => {
            const studies = [PYRETHROIDS, NOT_AVAILABLE, CARBAMATES, PYRETHROIDS].map(INSECTICIDE_CLASS =>
                createPreventionStudy({ INSECTICIDE_CLASS })
            );

            expect(getInsecticideClasses(studies)).toEqual([CARBAMATES, PYRETHROIDS]);
        });
    });
});
