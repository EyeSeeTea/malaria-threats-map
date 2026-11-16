import { firstValueFrom, of } from "rxjs";
import { toArray } from "rxjs/operators";
import { setAssayTypes, setType } from "../../../actions/prevention-actions";
import { setPreventionTypeEpic } from "../prevention-epics";
import {
    ACE1R,
    BIOCHEMICAL_ASSAY,
    KDR_L1014S,
    MOLECULAR_ASSAY,
    MONO_OXYGENASES,
    SYNERGIST_ASSAY,
    UNKNOWN_MECHANISM,
} from "../../../../../domain/entities/__fixtures__/studyValues";

function actionsAfterSetType(types: string[] | undefined) {
    return firstValueFrom(setPreventionTypeEpic(of(setType(types))).pipe(toArray()));
}

// Which assay types detect each mechanism is pinned in ResistanceMechanism.spec; this spec pins what the
// epic adds: the fallback to every assay type and the first-mechanism rule.
describe("setPreventionTypeEpic", () => {
    it("selects the assay types that detect the mechanism", async () => {
        expect(await actionsAfterSetType([ACE1R])).toEqual([setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY])]);
    });

    // Reachable from a link with a mechanism code the catalogue does not have.
    it("selects the three assay types for an unknown mechanism", async () => {
        expect(await actionsAfterSetType([UNKNOWN_MECHANISM])).toEqual([
            setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY]),
        ]);
    });

    it("selects the three assay types for an empty list and for undefined", async () => {
        const allAssayTypes = [setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY])];

        expect(await actionsAfterSetType([])).toEqual(allAssayTypes);
        expect(await actionsAfterSetType(undefined)).toEqual(allAssayTypes);
    });

    // The filter allows one mechanism, so only the first one decides the assay types.
    // A change that allows several must revisit this epic.
    it("looks only at the first selected mechanism", async () => {
        expect(await actionsAfterSetType([KDR_L1014S, MONO_OXYGENASES])).toEqual([setAssayTypes([MOLECULAR_ASSAY])]);
        expect(await actionsAfterSetType([MONO_OXYGENASES, KDR_L1014S])).toEqual([
            setAssayTypes([MOLECULAR_ASSAY, BIOCHEMICAL_ASSAY, SYNERGIST_ASSAY]),
        ]);
    });
});
