import {
    CARBAMATES,
    NEONICOTINOIDS,
    NOT_AVAILABLE,
    ORGANOCHLORINES,
    ORGANOPHOSPHATES,
    PYRETHROIDS,
    PYRROLES,
} from "../__fixtures__/studyValues";
import { getSelectableInsecticideClasses, sortInsecticideClasses } from "../InsecticideClass";

const UNKNOWN_CLASS = "UNKNOWN_CLASS";

const declaredOrder = [CARBAMATES, NEONICOTINOIDS, ORGANOCHLORINES, ORGANOPHOSPHATES, PYRETHROIDS, PYRROLES];

describe("InsecticideClass", () => {
    // Moved from InsecticideClassFilter: the map filter, its dashboards and the insecticide type
    // options must keep the same order.
    describe("sortInsecticideClasses", () => {
        it("pins the declared order", () => {
            expect(sortInsecticideClasses([...declaredOrder].reverse())).toEqual(declaredOrder);
        });

        it("puts a class outside the order before the declared ones", () => {
            expect(sortInsecticideClasses([PYRETHROIDS, UNKNOWN_CLASS, CARBAMATES])).toEqual([
                UNKNOWN_CLASS,
                CARBAMATES,
                PYRETHROIDS,
            ]);
        });

        it("leaves the given list as it was", () => {
            const classes = [PYRETHROIDS, CARBAMATES];

            sortInsecticideClasses(classes);

            expect(classes).toEqual([PYRETHROIDS, CARBAMATES]);
        });
    });

    describe("getSelectableInsecticideClasses", () => {
        it("leaves out NA and returns the rest in the declared order", () => {
            expect(getSelectableInsecticideClasses([PYRETHROIDS, NOT_AVAILABLE, ORGANOPHOSPHATES])).toEqual([
                ORGANOPHOSPHATES,
                PYRETHROIDS,
            ]);
        });

        it("returns an empty list for no classes", () => {
            expect(getSelectableInsecticideClasses([])).toEqual([]);
        });
    });
});
