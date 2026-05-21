import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    selectFilteredPreventionStudies,
    selectPreventionFilters,
    selectPreventionStudiesByMapTypeSelected,
} from "../../store/reducers/prevention-reducer";
import { setInsecticideClass } from "../../store/actions/prevention-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import i18next from "i18next";
import _ from "lodash";

const mapStateToProps = (state: State) => ({
    preventionStudiesOfMapType: selectPreventionStudiesByMapTypeSelected(state),
    preventionFilters: selectPreventionFilters(state),
    filteredStudies: selectFilteredPreventionStudies(state),
});

const mapDispatchToProps = {
    setInsecticideClass: setInsecticideClass,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const INSECTICIDE_CLASSES: string[] = [
    "CARBAMATES",
    "NEONICOTINOIDS",
    "ORGANOCHLORINES",
    "ORGANOPHOSPHATES",
    "PYRETHROIDS",
    "PYRROLES",
];

export function sortInsecticideClasses(insecticideClasses: string[]) {
    return insecticideClasses.sort((a, b) =>
        INSECTICIDE_CLASSES.indexOf(a) - INSECTICIDE_CLASSES.indexOf(b) > 0 ? 1 : -1
    );
}

export function getInsecticideClassOptions(insecticideClasses: string[]) {
    return sortInsecticideClasses(insecticideClasses.filter(insecticideClass => insecticideClass !== "NA")).map(
        insecticideClass => ({
            value: insecticideClass,
            label: i18next.t(insecticideClass),
        })
    );
}

function InsecticideClassFilter({ preventionStudiesOfMapType = [], preventionFilters, setInsecticideClass }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        setInsecticideClass((event.target as HTMLInputElement).value);
    };

    const insecticideClasses = _.uniq(preventionStudiesOfMapType.map(study => study.INSECTICIDE_CLASS));

    const options = getInsecticideClassOptions(insecticideClasses);

    return (
        <RadioGroupFilter
            label={t("common.filters.insecticide_class")}
            options={options}
            handleChange={handleChange}
            value={preventionFilters.insecticideClass}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InsecticideClassFilter);
