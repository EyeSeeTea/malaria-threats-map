import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPlasmodiumSpecies } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentPlasmodiumSpecies } from "../../store/actions/treatment-actions";
import { logEventAction } from "../../store/actions/base-actions";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    plasmodiumSpecies: selectPlasmodiumSpecies(state),
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setPlasmodiumSpecies: setTreatmentPlasmodiumSpecies,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const PLASMODIUM_SPECIES_SUGGESTIONS: any[] = [
    {
        label: "P. falciparum",
        value: "P._FALCIPARUM",
    },
    {
        label: "P. vivax",
        value: "P._VIVAX",
    },
    {
        label: "P. knowlesi",
        value: "P._KNOWLESI",
    },
    {
        label: "P. malariae",
        value: "P._MALARIAE",
    },
    {
        label: "P. ovale",
        value: "P._OVALE",
    },
];

const PlasmodiumSpeciesFilter: React.FC<Props> = ({ setPlasmodiumSpecies, treatmentFilters }) => {
    const { t } = useTranslation();

    return (
        <SingleFilter
            label={t("common.filters.plasmodium_species")}
            options={PLASMODIUM_SPECIES_SUGGESTIONS}
            onChange={setPlasmodiumSpecies}
            value={treatmentFilters.plasmodiumSpecies}
            analyticsFilterAction={"plasmodiumSpecies"}
            isClearable={false}
            isDisabled={treatmentFilters.mapType === 1}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlasmodiumSpeciesFilter);
