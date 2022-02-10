import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import ThemeFilter from "./filters/ThemeFilter";
import { State } from "../../store/types";
import { selectTheme } from "../../store/reducers/base-reducer";
import { setThemeAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
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
import { selectInvasiveStudies } from "../../store/reducers/invasive-reducer";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";

import MolecularMarkerSelector from "../filters/MolecularMarkerSelector";
import { Paper, Typography } from "@material-ui/core";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { fetchPreventionStudiesRequest } from "../../store/actions/prevention-actions";
import { fetchTreatmentStudiesRequest } from "../../store/actions/treatment-actions";
import { fetchInvasiveStudiesRequest } from "../../store/actions/invasive-actions";
import DataSetSelector from "./filters/DataSetSelector";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";

const Divider = styled.div`
    height: 16px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionStudies: selectPreventionStudies(state),
    invasiveStudies: selectInvasiveStudies(state),
    treatmentStudies: selectTreatmentStudies(state),
});

const mapDispatchToProps = {
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
    setTheme: setThemeAction,
};

type OwnProps = {
    onChange: (filters: any) => void;
    selections: any;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const Filters = ({
    onChange,
    selections,
    fetchInvasiveStudies,
    fetchPreventionStudies,
    fetchTreatmentStudies,
    preventionStudies,
    invasiveStudies,
    treatmentStudies,
}: Props) => {
    const { t } = useTranslation();
    const [yearRange, setYearRange] = useState({ minYear: 1978, maxYear: new Date().getFullYear() });
    const [countryOptions, setCountryOptions] = useState<Array<string>>([]);

    const getSelectedStudy = useCallback(() => {
        let studySelected: Array<PreventionStudy | TreatmentStudy | InvasiveStudy> = [];
        switch (selections.theme) {
            case "prevention":
                studySelected = preventionStudies;
                break;
            case "treatment":
                studySelected = treatmentStudies;
                break;
            case "invasive":
                studySelected = invasiveStudies;
                break;
        }
        return studySelected;
    }, [invasiveStudies, preventionStudies, treatmentStudies, selections.theme]);

    const getMinMaxYearAndSetYearRange = (yearStartedStudies: Array<number>) => {
        const minYear = yearStartedStudies.length > 0 ? Math.min(...yearStartedStudies) : 0;
        const maxYear = yearStartedStudies.length > 0 ? Math.max(...yearStartedStudies) : 0;
        setYearRange({ minYear, maxYear });
    };

    useEffect(() => {
        //when the selected theme or dataset changes, we recompute the available years and countries
        const studySelected = getSelectedStudy();
        const yearStartedStudies = studySelected
            .filter(study => Number(study.YEAR_START) !== 0)
            .map(study => Number(study.YEAR_START));
        getMinMaxYearAndSetYearRange(yearStartedStudies);

        const countriesStudies = _.uniq(studySelected.filter(study => study.ISO2 !== "").map(study => study.ISO2));
        setCountryOptions(countriesStudies);
    }, [
        selections.theme,
        selections.preventionDataset,
        selections.treatmentDataset,
        selections.invasiveDataset,
        preventionStudies,
        invasiveStudies,
        treatmentStudies,
        getSelectedStudy
    ]);

    /*
    if year was changed, then we get the studies + dataset with only the year available 
    and then those studies, compute the new country
    so if studies = prevention and year selected is 1981 and 1995, 
    then get preventionStudies that happened in 1981 and 1995 and those countries 
    */
    useEffect(() => {
        const studySelected = getSelectedStudy();
        const studiesWithinSelectedYears = studySelected.filter(study =>
            selections.years.includes(Number(study.YEAR_START))
        );
        const nonZeroStudies = studiesWithinSelectedYears.length > 0 ? studiesWithinSelectedYears : studySelected;
        const countriesStudies = _.uniq(nonZeroStudies.filter(study => study.ISO2 !== "").map(study => study.ISO2));
        setCountryOptions(countriesStudies);
    }, [selections.years, getSelectedStudy]);

    /*
    if country was changed, then we the studies + dataset with only the country available 
    and then those studies, compute the new years available
    so if studies = prevention and country was Afghanistan
    then get preventionStudies that happened in Afghanistan and get those years
    */
    useEffect(() => {
        const studySelected = getSelectedStudy();
        const studiesWithinSelectedCountries = studySelected.filter(study => selections.countries.includes(study.ISO2));
        const nonZeroStudies =
            studiesWithinSelectedCountries.length > 0 ? studiesWithinSelectedCountries : studySelected;
        const yearStartedStudies = _.uniq(
            nonZeroStudies.filter(study => Number(study.YEAR_START) !== 0).map(study => Number(study.YEAR_START))
        );
        getMinMaxYearAndSetYearRange(yearStartedStudies);
    }, [selections.countries, getSelectedStudy]);

    const onSetTheme = (value: string) => {
        onChange({
            ...selections,
            theme: value,
            years: [],
            countries: [],
        });
    };

    const onSetPreventionDataset = (value: string) => {
        fetchPreventionStudies();
        onChange({
            ...selections,
            preventionDataset: value,
            years: [],
            countries: [],
        });
    };

    const onSetTreatmentDataset = (value: string) => {
        fetchTreatmentStudies();
        onChange({
            ...selections,
            treatmentDataset: value,
            years: [],
            countries: [],
        });
    };

    const onSetInvasiveDataset = (value: string) => {
        fetchInvasiveStudies();
        onChange({
            ...selections,
            invasiveDataset: value,
            years: [],
            countries: [],
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
                    <DataSetSelector theme={theme} value={preventionDataset} onChange={onSetPreventionDataset} />
                )}
                {theme === "treatment" && (
                    <DataSetSelector theme={theme} value={treatmentDataset} onChange={onSetTreatmentDataset} />
                )}
                {theme === "invasive" && (
                    <DataSetSelector theme={theme} value={invasiveDataset} onChange={onSetInvasiveDataset} />
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
                <YearsSelector
                    value={years}
                    onChange={onSetYears}
                    minYear={yearRange.minYear}
                    maxYear={yearRange.maxYear}
                />
                <CountriesSelector value={countries} countryOptions={countryOptions} onChange={onSetCountries} />
            </Paper>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
