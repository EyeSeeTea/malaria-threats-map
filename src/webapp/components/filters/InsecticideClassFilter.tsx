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
import { getSelectableInsecticideClasses, sortInsecticideClasses } from "../../../domain/entities/InsecticideClass";

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

export { sortInsecticideClasses };

export function getInsecticideClassOptions(insecticideClasses: string[]) {
    return getSelectableInsecticideClasses(insecticideClasses).map(insecticideClass => ({
        value: insecticideClass,
        label: i18next.t(insecticideClass),
    }));
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
