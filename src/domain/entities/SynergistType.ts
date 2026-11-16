import _c from "./generic/Collection";
import { synergistAssayType } from "./AssayType";
import { PreventionStudy } from "./PreventionStudy";

type SynergistTypeSource = Pick<PreventionStudy, "TYPE" | "ASSAY_TYPE">;

/** The distinct test types of the synergist-insecticide bioassays, in the order they first appear. */
export function getSynergistTypes(studies: ReadonlyArray<SynergistTypeSource>): ReadonlyArray<string> {
    return _c([...studies])
        .select(study => study.ASSAY_TYPE === synergistAssayType)
        .map(study => study.TYPE)
        .compact()
        .reject(type => type === "")
        .uniq()
        .toArray();
}
