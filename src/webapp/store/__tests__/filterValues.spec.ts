import { CARBAMATES, ORGANOPHOSPHATES, PYRETHROIDS } from "../../../domain/entities/__fixtures__/studyValues";
import { chooseFilterValue } from "../filterValues";

describe("filterValues", () => {
    describe("chooseFilterValue", () => {
        it("keeps the current value when it is offered", () => {
            expect(chooseFilterValue([CARBAMATES, ORGANOPHOSPHATES, PYRETHROIDS], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(
                ORGANOPHOSPHATES
            );
        });

        it("takes the preferred value when the current one is not offered", () => {
            expect(chooseFilterValue([CARBAMATES, PYRETHROIDS], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(PYRETHROIDS);
        });

        it("takes the preferred value when there is no current value", () => {
            expect(chooseFilterValue([CARBAMATES, PYRETHROIDS], PYRETHROIDS)).toBe(PYRETHROIDS);
        });

        it("takes the first option when neither the current nor the preferred value is offered", () => {
            expect(chooseFilterValue([CARBAMATES, ORGANOPHOSPHATES], PYRETHROIDS)).toBe(CARBAMATES);
        });

        it("keeps the current value when nothing is offered, because the studies are not loaded yet", () => {
            expect(chooseFilterValue([], PYRETHROIDS, ORGANOPHOSPHATES)).toBe(ORGANOPHOSPHATES);
        });

        it("takes the preferred value when nothing is offered and there is no current value", () => {
            expect(chooseFilterValue([], PYRETHROIDS)).toBe(PYRETHROIDS);
        });
    });
});
