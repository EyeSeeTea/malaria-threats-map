import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPlasmodiumSpecies } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import {
    setTreatmentPlasmodiumSpecies,
    setTreatmentPlasmodiumSpeciesArray,
} from "../../store/actions/treatment-actions";
import { logEventAction } from "../../store/actions/base-actions";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";
import MultiFilter from "./common/MultiFilter";

const mapStateToProps = (state: State) => ({
    plasmodiumSpecies: selectPlasmodiumSpecies(state),
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setPlasmodiumSpecies: setTreatmentPlasmodiumSpecies,
    setPlasmodiumSpeciesArray: setTreatmentPlasmodiumSpeciesArray,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    isMulti?: boolean;
};
type Props = DispatchProps & StateProps & OwnProps;

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

const PlasmodiumSpeciesFilter: React.FC<Props> = ({
    setPlasmodiumSpecies,
    setPlasmodiumSpeciesArray,
    treatmentFilters,
    isMulti = false,
}) => {
    const { t } = useTranslation();

    return isMulti ? (
        <MultiFilter
            placeholder={t("common.filters.select_plasmodium_species")}
            options={PLASMODIUM_SPECIES_SUGGESTIONS}
            onChange={setPlasmodiumSpeciesArray}
            value={treatmentFilters.plasmodiumSpeciesArray}
            analyticsMultiFilterAction={"plasmodiumSpecies"}
            isClearable={true}
        />
    ) : (
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
