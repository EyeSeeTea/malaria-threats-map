import React, { useCallback, useEffect } from "react";
import { State } from "../../../store/types";
import {
    selectFilters,
    selectLastUpdatedDates,
    selectMaxMinYears,
    selectRegion,
    selectTheme,
} from "../../../store/reducers/base-reducer";
import { setActionGroupSelected, setFiltersAction, setMaxMinYearsAction } from "../../../store/actions/base-actions";
import { connect } from "react-redux";

import { Button, Card, Divider, Grid, List, ListItem, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import { Trans, useTranslation } from "react-i18next";
import {
    DatabaseSelection,
    DiagnosisDatabaseSelection,
    InvasiveDatabaseSelection,
    PreventionDatabaseSelection,
    TreatmentDatabaseSelection,
} from "../types";
import ThemeMapActions from "../../map-actions/ThemeMapActions";
import DataMapActions from "../../map-actions/DataMapActions";
import LocationMapActions from "../../map-actions/LocationMapActions";
import {
    selectFilteredPreventionStudies,
    selectPreventionFilters,
    selectPreventionStudies,
} from "../../../store/reducers/prevention-reducer";
import {
    selectFilteredInvasiveStudies,
    selectInvasiveFilters,
    selectInvasiveStudies,
} from "../../../store/reducers/invasive-reducer";
import {
    selectDiagnosisFilters,
    selectDiagnosisStudies,
    selectFilteredDiagnosisStudies,
} from "../../../store/reducers/diagnosis-reducer";
import {
    selectFilteredTreatmentStudies,
    selectTreatmentFilters,
    selectTreatmentStudies,
} from "../../../store/reducers/treatment-reducer";
import {
    diagnosisFiltersToString,
    getLocation,
    invasiveFiltersToString,
    preventionFiltersToString,
    treatmentFiltersToString,
} from "../../map-actions/utils";

import { DatabaseItem } from "./DatabaseItem";
import { fetchPreventionStudiesRequest, setPreventionFilteredStudies } from "../../../store/actions/prevention-actions";
import {
    fetchDiagnosisStudiesRequest,
    setDiagnosisFilteredStudiesAction,
} from "../../../store/actions/diagnosis-actions";
import { fetchTreatmentStudiesRequest, setFilteredStudiesAction } from "../../../store/actions/treatment-actions";
import { fetchInvasiveStudiesRequest, setInvasiveFilteredStudiesAction } from "../../../store/actions/invasive-actions";
import {
    filterDiagnosisStudies,
    filterInvasiveStudies,
    filterPreventionStudies,
    filterTreatmentStudies,
} from "../../layers/studies-filters";
import DataSetMapActions from "../../map-actions/DataSetMapActions";
import {
    diagnosisDatasetSuggestions,
    invasiveDatasetSuggestions,
    preventionDatasetSuggestions,
    treatmentDatasetSuggestions,
} from "../filters/DataSetSelector";
import { getMinMaxYears } from "../../../../domain/entities/Study";
import { useLastUpdatedDatesByThemeAndDataSet } from "../../last-updated/useLastUpdatedDatesByThemeAndDataSet";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionStudies: selectPreventionStudies(state),
    diagnosisStudies: selectDiagnosisStudies(state),
    treatmentStudies: selectTreatmentStudies(state),
    invasiveStudies: selectInvasiveStudies(state),
    preventionFilteredStudies: selectFilteredPreventionStudies(state),
    diagnosisFilteredStudies: selectFilteredDiagnosisStudies(state),
    treatmentFilteredStudies: selectFilteredTreatmentStudies(state),
    invasiveFilteredStudies: selectFilteredInvasiveStudies(state),
    preventionFilters: selectPreventionFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    maxMinYears: selectMaxMinYears(state),
    yearFilters: selectFilters(state),
    region: selectRegion(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
});

const mapDispatchToProps = {
    setActionGroupSelected: setActionGroupSelected,
    fetchPreventionStudies: fetchPreventionStudiesRequest,
    fetchDiagnosisStudies: fetchDiagnosisStudiesRequest,
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
    fetchInvasiveStudies: fetchInvasiveStudiesRequest,
    setPreventionFilteredStudies: setPreventionFilteredStudies,
    setDiagnosisFilteredStudies: setDiagnosisFilteredStudiesAction,
    setTreatmentFilteredStudies: setFilteredStudiesAction,
    setInvasiveFilteredStudies: setInvasiveFilteredStudiesAction,
    setYears: setFiltersAction,
    setMaxMinYears: setMaxMinYearsAction,
};

type OwnProps = {
    selectedDatabases: DatabaseSelection[];
    onChangeSelectedDatabases: (databases: DatabaseSelection[]) => void;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const Data: React.FC<Props> = ({
    selectedDatabases,
    theme,
    lastUpdatedDates,
    preventionFilters,
    treatmentFilters,
    diagnosisFilters,
    invasiveFilters,
    maxMinYears,
    yearFilters,
    region,
    fetchPreventionStudies,
    fetchDiagnosisStudies,
    fetchTreatmentStudies,
    fetchInvasiveStudies,
    preventionStudies,
    diagnosisStudies,
    treatmentStudies,
    invasiveStudies,
    preventionFilteredStudies,
    diagnosisFilteredStudies,
    treatmentFilteredStudies,
    invasiveFilteredStudies,
    setPreventionFilteredStudies,
    setDiagnosisFilteredStudies,
    setTreatmentFilteredStudies,
    setInvasiveFilteredStudies,
    setActionGroupSelected,
    onChangeSelectedDatabases,
    setYears,
    setMaxMinYears,
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        setActionGroupSelected("THEME");
    }, [setActionGroupSelected]);

    useEffect(() => {
        theme === "prevention"
            ? fetchPreventionStudies()
            : theme === "diagnosis"
            ? fetchDiagnosisStudies()
            : theme === "treatment"
            ? fetchTreatmentStudies()
            : fetchInvasiveStudies();
    }, [theme, fetchPreventionStudies, fetchDiagnosisStudies, fetchTreatmentStudies, fetchInvasiveStudies]);

    useEffect(() => {
        setPreventionFilteredStudies(
            filterPreventionStudies(preventionStudies, preventionFilters, yearFilters, region, "download")
        );
    }, [preventionStudies, preventionFilters, region, yearFilters, setPreventionFilteredStudies]);

    useEffect(() => {
        setDiagnosisFilteredStudies(
            filterDiagnosisStudies(diagnosisStudies, diagnosisFilters, yearFilters, region, "download")
        );
    }, [diagnosisStudies, diagnosisFilters, region, yearFilters, setDiagnosisFilteredStudies]);

    useEffect(() => {
        setTreatmentFilteredStudies(
            filterTreatmentStudies(treatmentStudies, treatmentFilters, yearFilters, region, "download")
        );
    }, [treatmentStudies, treatmentFilters, region, yearFilters, setTreatmentFilteredStudies]);

    useEffect(() => {
        setInvasiveFilteredStudies(
            filterInvasiveStudies(invasiveStudies, invasiveFilters, yearFilters, region, "download")
        );
    }, [invasiveStudies, invasiveFilters, region, yearFilters, setInvasiveFilteredStudies]);

    useEffect(() => {
        const minMaxYears =
            theme === "prevention"
                ? getMinMaxYears(preventionStudies)
                : theme === "diagnosis"
                ? getMinMaxYears(diagnosisStudies, false)
                : theme === "treatment"
                ? getMinMaxYears(treatmentStudies, false)
                : getMinMaxYears(invasiveStudies);

        setMaxMinYears(minMaxYears);
        setYears(minMaxYears);
    }, [theme, preventionStudies, diagnosisStudies, treatmentStudies, invasiveStudies, setMaxMinYears, setYears]);

    const date = useLastUpdatedDatesByThemeAndDataSet(
        lastUpdatedDates,
        theme,
        preventionFilters,
        treatmentFilters,
        diagnosisFilters,
        invasiveFilters
    );

    const handleAddToDownload = useCallback(() => {
        switch (theme) {
            case "prevention": {
                const database: PreventionDatabaseSelection = {
                    id: Math.random(),
                    kind: "prevention",
                    filters: preventionFilters,
                    dataset: preventionDatasetSuggestions
                        .find(ds => ds.value === preventionFilters.dataset)
                        .value.toString(),
                    filtersValue:
                        preventionFiltersToString(preventionFilters, maxMinYears, yearFilters, "download") ||
                        t("mapActions.all"),
                    filteredStudies: preventionFilteredStudies,
                    location: getLocation(region) || t("mapActions.all"),
                };

                onChangeSelectedDatabases([...selectedDatabases, database]);
                break;
            }
            case "diagnosis": {
                const database: DiagnosisDatabaseSelection = {
                    id: Math.random(),
                    kind: "diagnosis",
                    filters: diagnosisFilters,
                    dataset: diagnosisDatasetSuggestions
                        .find(ds => ds.value === diagnosisFilters.dataset)
                        .value.toString(),
                    filtersValue:
                        diagnosisFiltersToString(diagnosisFilters, maxMinYears, yearFilters, "download") ||
                        t("mapActions.all"),
                    filteredStudies: diagnosisFilteredStudies,
                    location: getLocation(region) || t("mapActions.all"),
                };

                onChangeSelectedDatabases([...selectedDatabases, database]);
                break;
            }
            case "invasive": {
                const database: InvasiveDatabaseSelection = {
                    id: Math.random(),
                    kind: "invasive",
                    filters: invasiveFilters,
                    dataset: invasiveDatasetSuggestions
                        .find(ds => ds.value === invasiveFilters.dataset)
                        .value.toString(),
                    filtersValue:
                        invasiveFiltersToString(invasiveFilters, maxMinYears, yearFilters, "download") ||
                        t("mapActions.all"),
                    filteredStudies: invasiveFilteredStudies,
                    location: getLocation(region) || t("mapActions.all"),
                };

                onChangeSelectedDatabases([...selectedDatabases, database]);
                break;
            }
            case "treatment": {
                const database: TreatmentDatabaseSelection = {
                    id: Math.random(),
                    kind: "treatment",
                    filters: treatmentFilters,
                    dataset: treatmentDatasetSuggestions
                        .find(ds => ds.value === treatmentFilters.dataset)
                        .value.toString(),
                    filtersValue:
                        treatmentFiltersToString(treatmentFilters, maxMinYears, yearFilters, "download") ||
                        t("mapActions.all"),
                    filteredStudies: treatmentFilteredStudies,
                    location: getLocation(region) || t("mapActions.all"),
                };

                onChangeSelectedDatabases([...selectedDatabases, database]);
                break;
            }
        }
    }, [
        theme,
        selectedDatabases,
        preventionFilters,
        diagnosisFilters,
        treatmentFilters,
        invasiveFilters,
        maxMinYears,
        yearFilters,
        region,
        preventionFilteredStudies,
        diagnosisFilteredStudies,
        treatmentFilteredStudies,
        invasiveFilteredStudies,
        onChangeSelectedDatabases,
        t,
    ]);

    const handleRemoveToDownload = useCallback(
        (id: number) => {
            onChangeSelectedDatabases(selectedDatabases.filter(db => db.id !== id));
        },
        [selectedDatabases, onChangeSelectedDatabases]
    );

    return (
        <React.Fragment>
            <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 4 }}>
                {t("common.data_download.data_step.title")}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 6 }}>
                <Trans i18nKey="common.data_download.data_step.p1">
                    This dialogue allows you to download data from four of the WHO global databases: insecticide
                    resistance in malaria vectors, invasive vector species, antimalarial drug efficacy and resistance,
                    and <i>pfhrp2/3</i> gene deletions. A link to the original data source and citation are included in
                    each dataset, where available.
                </Trans>
            </Typography>
            <Grid container rowSpacing={3} columnSpacing={4}>
                <Grid item md={6} xs={12}>
                    <ListCard elevation={0}>
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            textTransform="uppercase"
                            sx={{ marginTop: 1, marginBottom: 1 }}
                        >
                            {t("common.data_download.data_step.db_download_list")}
                        </Typography>

                        {selectedDatabases.length === 0 ? (
                            <Typography variant="body2" color="GrayText">
                                {t("common.data_download.data_step.db_download_helper_text")}
                            </Typography>
                        ) : (
                            <React.Fragment>
                                <List>
                                    {selectedDatabases.map((database, index) => {
                                        return (
                                            <DatabaseItem
                                                key={database.id}
                                                database={database}
                                                onRemoveDatabase={handleRemoveToDownload}
                                                addDivider={index < selectedDatabases.length - 1}
                                            />
                                        );
                                    })}
                                </List>
                                {selectedDatabases.some(database => database.kind === "prevention") && (
                                    <React.Fragment>
                                        <Divider sx={{ marginBottom: 2 }} />
                                        <Typography variant="caption" lineHeight="6px">
                                            {t("common.data_download.data_step.prevention_warning")}
                                        </Typography>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </ListCard>
                </Grid>
                <Grid item md={6} xs={12}>
                    <DataSelectionCard>
                        <StyledList>
                            <ThemeMapActions from="download" themeItemGridSize={3} />
                            <Divider />
                            <DataSetMapActions />
                            <Divider />
                            <DataMapActions from="download" />
                            <Divider />
                            <LocationMapActions />
                            <FooterDivider />
                            <Footer>
                                <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
                                    <Stack direction="column" alignItems="left">
                                        <Typography variant="body2">
                                            {t("common.data_download.data_step.last_updated")}
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold">
                                            {date?.toLocaleDateString() || ""}
                                        </Typography>
                                    </Stack>

                                    <AddToDownloadButton variant="outlined" onClick={handleAddToDownload}>
                                        {t("common.data_download.data_step.add_to_download")}
                                    </AddToDownloadButton>
                                </Stack>
                            </Footer>
                        </StyledList>
                    </DataSelectionCard>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Data);

const ListCard = styled(Card)`
    padding: 16px;
    border-radius: 12px;
    background: #f5f5f5;
    min-height: 300px;
    max-height: 480px;
    overflow: auto;
`;

const DataSelectionCard = styled(Card)`
    padding: 0px;
    border-radius: 12px;
    width: 550px;
    overflow: visible;
`;

const StyledList = styled(List)`
    padding: 0px;
`;

const FooterDivider = styled(Divider)`
    background: #21807d4d;
    height: 4px;
`;

const Footer = styled(ListItem)`
    padding: 24px 32px;
`;

const AddToDownloadButton = styled(Button)`
    width: 175px;
    border: 2px solid #2fb3af;
    color: #2fb3af;
`;
