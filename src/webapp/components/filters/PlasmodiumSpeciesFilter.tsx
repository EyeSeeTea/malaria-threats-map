import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPlasmodiumSpecies } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { setTreatmentPlasmodiumSpecies } from "../../store/actions/treatment-actions";
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

const PlasmodiumSpeciesFilter: React.FC<Props> = ({ setPlasmodiumSpecies, treatmentFilters, isMulti = false }) => {
    const { t } = useTranslation();

    const handleChange = React.useCallback(
        (selection?: string | string[]) => {
            if (isMulti && Array.isArray(selection)) {
                setPlasmodiumSpecies(selection);
            } else {
                const selectedPlasmodiumSpecie = selection && typeof selection === "string" ? [selection] : [];
                setPlasmodiumSpecies(selectedPlasmodiumSpecie);
            }
        },
        [isMulti, setPlasmodiumSpecies]
    );

    const value: string | string[] = React.useMemo(() => {
        if (isMulti) {
            return treatmentFilters.plasmodiumSpecies ?? [];
        }
        return treatmentFilters.plasmodiumSpecies ? treatmentFilters.plasmodiumSpecies[0] : null;
    }, [isMulti, treatmentFilters.plasmodiumSpecies]);

    return isMulti ? (
        <MultiFilter
            placeholder={t("common.filters.select_plasmodium_species")}
            options={PLASMODIUM_SPECIES_SUGGESTIONS}
            onChange={handleChange}
            value={value as string[]}
            analyticsMultiFilterAction={"plasmodiumSpecies"}
            isClearable={true}
        />
    ) : (
        <SingleFilter
            label={t("common.filters.plasmodium_species")}
            options={PLASMODIUM_SPECIES_SUGGESTIONS}
            onChange={handleChange}
            value={value as string}
            analyticsFilterAction={"plasmodiumSpecies"}
            isClearable={false}
            isDisabled={treatmentFilters.mapType === 1}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PlasmodiumSpeciesFilter);
