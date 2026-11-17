import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { State } from "../../store/types";
import { selectPreventionFilters, selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters, selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { setPreventionDisease } from "../../store/actions/prevention-actions";
import { setInvasiveDisease } from "../../store/actions/invasive-actions";
import { getDiseases } from "../../../domain/entities/Disease";
import { Study } from "../../../domain/entities/Study";
import { Option } from "../BasicSelect";
import SingleFilter from "./common/SingleFilter";

type DiseaseSource = Pick<Study, "DISEASE">;

type DiseaseFilterProps = Readonly<{
    studies: ReadonlyArray<DiseaseSource>;
    disease: string | undefined;
    setDisease: (disease: string | undefined) => void;
}>;

/** The label of a disease: its xMART translation, or its code when it has none. */
export function getDiseaseLabel(disease: string): string {
    return i18next.t(`DISEASE.${disease}`, { defaultValue: disease });
}

/** One option per disease the studies of the theme carry. No options when the studies carry no disease. */
export function getDiseaseFilterOptions(studies: ReadonlyArray<DiseaseSource>): Option[] {
    return getDiseases(studies).map(disease => ({ value: disease, label: getDiseaseLabel(disease) }));
}

/**
 * The disease of a theme, a single-select dropdown that is never empty: the epics select the default
 * disease, or the first one, as soon as the studies load, and the user cannot clear it. With one
 * disease it shows that disease, selected, as the only option. Studies without a disease are a data
 * error: with none carrying one, the filter renders nothing.
 */
function DiseaseFilter({ studies, disease, setDisease }: DiseaseFilterProps) {
    const { t } = useTranslation();
    const options = React.useMemo(() => getDiseaseFilterOptions(studies), [studies]);

    if (options.length === 0) return null;

    return (
        <SingleFilter
            labelPosition="middle"
            label={t("common.filters.disease")}
            options={options}
            onChange={setDisease}
            value={disease}
            isClearable={false}
            analyticsFilterAction={"disease"}
        />
    );
}

export const PreventionDiseaseFilter = connect(
    (state: State) => ({
        studies: selectPreventionStudies(state),
        disease: selectPreventionFilters(state).disease,
    }),
    { setDisease: setPreventionDisease }
)(DiseaseFilter);

export const InvasiveDiseaseFilter = connect(
    (state: State) => ({
        studies: selectInvasiveStudies(state),
        disease: selectInvasiveFilters(state).disease,
    }),
    { setDisease: setInvasiveDisease }
)(DiseaseFilter);
