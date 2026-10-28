import { firstValueFrom, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { setAssayTypes, setType } from "../../../actions/prevention-actions";
import { setPreventionTypeEpic } from "../prevention-epics";
import {
    ACE1R,
    BIOCHEMICAL,
    KDR_L1014S,
    MOLECULAR,
    MONO_OXYGENASES,
    SYNERGIST,
} from "../../../../../domain/entities/__fixtures__/studyValues";

function actionsAfterSetType(types: string[] | undefined) {
    return firstValueFrom(setPreventionTypeEpic(of(setType(types))).pipe(toArray()));
}

describe("setPreventionTypeEpic", () => {
    it.each(["KDR_L1014S", "KDR_L1014F", "KDR_(MUTATION_UNSPECIFIED)"])(
        "selects only the molecular assay for %s",
        async mechanism => {
            expect(await actionsAfterSetType([mechanism])).toEqual([setAssayTypes([MOLECULAR])]);
        }
    );

    it("selects the molecular and biochemical assays for ACE1R", async () => {
        expect(await actionsAfterSetType([ACE1R])).toEqual([setAssayTypes([MOLECULAR, BIOCHEMICAL])]);
    });

    it.each(["MONO_OXYGENASES", "ESTERASES", "GSTS", "UNKNOWN_MECHANISM"])(
        "selects the three assay types for %s",
        async mechanism => {
            expect(await actionsAfterSetType([mechanism])).toEqual([
                setAssayTypes([MOLECULAR, BIOCHEMICAL, SYNERGIST]),
            ]);
        }
    );

    it("selects the three assay types for an empty list and for undefined", async () => {
        const allAssayTypes = [setAssayTypes([MOLECULAR, BIOCHEMICAL, SYNERGIST])];

        expect(await actionsAfterSetType([])).toEqual(allAssayTypes);
        expect(await actionsAfterSetType(undefined)).toEqual(allAssayTypes);
    });

    it("looks only at the first selected mechanism (finding)", async () => {
        expect(await actionsAfterSetType([KDR_L1014S, MONO_OXYGENASES])).toEqual([setAssayTypes([MOLECULAR])]);
        expect(await actionsAfterSetType([MONO_OXYGENASES, KDR_L1014S])).toEqual([
            setAssayTypes([MOLECULAR, BIOCHEMICAL, SYNERGIST]),
        ]);
    });
});
