import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Translation } from "../../types/Translation";
import { useTranslation } from "react-i18next";
import { selectTypes } from "../../store/reducers/translations-reducer";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { setType } from "../../store/actions/prevention-actions";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import i18next from "i18next";

export const WHITELISTED_TYPES = [
    "MONO_OXYGENASES",
    "ESTERASES",
    "GSTS",
    "KDR_L1014S",
    "KDR_L1014F",
    "KDR_(MUTATION_UNSPECIFIED)",
    "ACE1R",
];

const mapStateToProps = (state: State) => ({
    types: selectTypes(state),
    preventionFilters: selectPreventionFilters(state),
});

const mapDispatchToProps = {
    setType: setType,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export function cleanMechanismTypeOptions(values: string[]) {
    const filteredTypes = WHITELISTED_TYPES.map(wl_type => values.find((value: any) => value === wl_type)).filter(
        Boolean
    );

    const options = filteredTypes.filter(value => value !== "NA");

    return options;
}

function MechanismTypeFilter({ types = [], preventionFilters, setType, logEventAction }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setType(newValue);
        logEventAction({ category: "filter", action: "mechanismType", label: newValue });
    };
    const suggestions: Translation[] = types as Translation[];

    const options = cleanMechanismTypeOptions(suggestions.map((type: Translation) => type.VALUE_)).map(value => ({
        value: value,
        label: i18next.t(`TYPE.${value}`),
    }));

    return (
        <RadioGroupFilter
            label={t("common.filters.mechanism_type")}
            options={options}
            handleChange={handleChange}
            value={preventionFilters.type}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MechanismTypeFilter);
