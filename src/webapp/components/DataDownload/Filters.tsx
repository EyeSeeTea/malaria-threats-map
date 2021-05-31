import React from "react";
import ThemeFilter from "./filters/ThemeFilter";
import { State } from "../../store/types";
import { selectTheme } from "../../store/reducers/base-reducer";
import { setThemeAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import PreventionDataSetSelector from "./filters/PreventionDataSetSelector";
import InvasiveDataSetSelector from "./filters/InvasiveDataSetSelector";
import TreatmentDataSetSelector from "./filters/TreatmentDataSetSelector";
import YearsSelector from "./filters/YearsSelector";
import CountriesSelector from "./filters/CountriesSelector";
import InsecticideClassSelector from "../filters/InsecticideClassSelector";
import SpeciesSelector from "../filters/SpeciesSelector";
import TypeSelector from "../filters/TypeSelector";
import DrugsSelector from "../filters/DrugsSelector";
import PlasmodiumSpeciesSelector from "../filters/PlasmodiumSpeciesSelector";
import SynergistTypesSelector from "../filters/SynergistTypesSelector";
import InsecticideTypeSelector from "../filters/InsecticideTypeSelector";
import MechanismTypeSelector from "../filters/MechanismTypeSelector";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import MolecularMarkerSelector from "../filters/MolecularMarkerSelector";
import { Paper, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Divider = styled.div`
    height: 16px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionStudies: selectPreventionStudies(state),
});

const mapDispatchToProps = {
    setTheme: setThemeAction,
};

type OwnProps = {
    onChange: (filters: any) => void;
    selections: any;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const Filters = ({ onChange, selections }: Props) => {
    const { t } = useTranslation();

    const onSetTheme = (value: string) => {
        onChange({
            ...selections,
            theme: value,
        });
    };

    const onSetPreventionDataset = (value: string) => {
        onChange({
            ...selections,
            preventionDataset: value,
        });
    };

    const onSetTreatmentDataset = (value: string) => {
        onChange({
            ...selections,
            treatmentDataset: value,
        });
    };

    const onSetInvasiveDataset = (value: string) => {
        onChange({
            ...selections,
            invasiveDataset: value,
        });
    };

    const onSetInsecticideClasses = (value: string[]) => {
        onChange({
            ...selections,
            insecticideClasses: value,
        });
    };

    const onSetInsecticideTypes = (value: string[]) => {
        onChange({
            ...selections,
            insecticideTypes: value,
        });
    };

    const onSetMechanismTypes = (value: string[]) => {
        onChange({
            ...selections,
            mechanismTypes: value,
        });
    };

    const onSetSpecies = (value: string[]) => {
        onChange({
            ...selections,
            species: value,
        });
    };

    const onSetTypes = (value: string[]) => {
        onChange({
            ...selections,
            types: value,
        });
    };

    const onSetDrugs = (value: string[]) => {
        onChange({
            ...selections,
            drugs: value,
        });
    };

    const onSetPlasmodiumSpecies = (value: string[]) => {
        onChange({
            ...selections,
            plasmodiumSpecies: value,
        });
    };

    const onSetMolecularMarkers = (value: string[]) => {
        onChange({
            ...selections,
            molecularMarkers: value,
        });
    };

    const onSetSynergistTypes = (value: string[]) => {
        onChange({
            ...selections,
            synergistTypes: value,
        });
    };

    const onSetYears = (value: number[]) => {
        onChange({
            ...selections,
            years: value,
        });
    };

    const onSetCountries = (value: string[]) => {
        onChange({
            ...selections,
            countries: value,
        });
    };

    const {
        theme,
        preventionDataset,
        treatmentDataset,
        invasiveDataset,
        insecticideClasses,
        insecticideTypes,
        synergistTypes,
        mechanismTypes,
        molecularMarkers,
        types,
        species,
        plasmodiumSpecies,
        drugs,
        years,
        countries,
    } = selections;

    return (
        <div>
            <Typography variant="subtitle1" color="textSecondary">
                {t("common.data_download.dataset")}
            </Typography>
            <Paper
                style={{
                    paddingTop: "16px",
                    paddingBottom: "16px",
                }}
            >
                <ThemeFilter value={theme} onChange={onSetTheme} />
                {theme === "prevention" && (
                    <PreventionDataSetSelector value={preventionDataset} onChange={onSetPreventionDataset} />
                )}
                {theme === "treatment" && (
                    <TreatmentDataSetSelector value={treatmentDataset} onChange={onSetTreatmentDataset} />
                )}
                {theme === "invasive" && (
                    <InvasiveDataSetSelector value={invasiveDataset} onChange={onSetInvasiveDataset} />
                )}
            </Paper>
            <Divider />
            <Typography variant="subtitle1" color="textSecondary">
                {t("common.data_download.step3.filters.additional")}
            </Typography>
            <Paper
                style={{
                    paddingTop: "16px",
                    paddingBottom: "16px",
                }}
            >
                {theme === "prevention" && (
                    <>
                        {["INSECTICIDE_BIOASSAY"].includes(preventionDataset) ? (
                            <>
                                <SynergistTypesSelector onChange={onSetSynergistTypes} value={synergistTypes} />
                            </>
                        ) : ["MOLECULAR_ASSAY", "BIOCHEMICAL_ASSAY"].includes(preventionDataset) ? (
                            <>
                                <MechanismTypeSelector
                                    dataset={preventionDataset}
                                    value={mechanismTypes}
                                    onChange={onSetMechanismTypes}
                                />
                            </>
                        ) : ["DISCRIMINATING_CONCENTRATION_BIOASSAY", "INTENSITY_CONCENTRATION_BIOASSAY"].includes(
                              preventionDataset
                          ) ? (
                            <>
                                <InsecticideClassSelector
                                    onChange={onSetInsecticideClasses}
                                    value={insecticideClasses}
                                />
                                <InsecticideTypeSelector onChange={onSetInsecticideTypes} value={insecticideTypes} />
                                <TypeSelector onChange={onSetTypes} value={types} />
                            </>
                        ) : (
                            <></>
                        )}
                        {preventionDataset && <SpeciesSelector onChange={onSetSpecies} value={species} />}
                    </>
                )}
                {theme === "treatment" && (
                    <>
                        {["THERAPEUTIC_EFFICACY_STUDY"].includes(treatmentDataset) ? (
                            <>
                                <PlasmodiumSpeciesSelector
                                    onChange={onSetPlasmodiumSpecies}
                                    value={plasmodiumSpecies}
                                />
                                <DrugsSelector onChange={onSetDrugs} value={drugs} />
                            </>
                        ) : ["MOLECULAR_MARKER_STUDY"].includes(treatmentDataset) ? (
                            <>
                                <MolecularMarkerSelector value={molecularMarkers} onChange={onSetMolecularMarkers} />
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                )}
                <YearsSelector value={years} onChange={onSetYears} />
                <CountriesSelector value={countries} onChange={onSetCountries} />
            </Paper>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
