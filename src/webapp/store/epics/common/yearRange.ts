import { belongsToDisease } from "../../../../domain/entities/Disease";
import { getMinMaxYears, Study } from "../../../../domain/entities/Study";
import { setFiltersAction, setMaxMinYearsAction } from "../../actions/base-actions";
import { MapTheme, State } from "../../types";

/**
 * The studies a map computes its year range from: those of the chosen disease, or all of them while
 * no disease is set, as before the disease filter.
 */
export function getStudiesForYearRange<S extends Pick<Study, "DISEASE">>(
    studies: ReadonlyArray<S>,
    disease: string | undefined
): S[] {
    return disease === undefined ? [...studies] : studies.filter(study => belongsToDisease(study, disease));
}

/**
 * The year range of the map when its disease is set or switched: the slider and the selected years
 * take the range of the studies of that disease when it differs from the slider's, so the slider
 * starts at the first year with studies of the disease. With the same range, as malaria once its
 * studies have loaded, nothing moves and the selected years are kept.
 */
export function getYearRangeOfDiseaseActions(
    props: Readonly<{ diseaseStudies: Study[]; theme: MapTheme; state: State; filterStart?: number }>
) {
    const { diseaseStudies, theme, state, filterStart } = props;
    if (state.malaria.theme !== theme || diseaseStudies.length === 0) return [];

    const [start, end] = getMinMaxYears(diseaseStudies);
    const [sliderStart, sliderEnd] = state.malaria.maxMinYears;
    const sliderShowsDiseaseRange = sliderStart === start && sliderEnd === end;

    return sliderShowsDiseaseRange
        ? []
        : [setMaxMinYearsAction([start, end]), setFiltersAction([filterStart ?? start, end])];
}
