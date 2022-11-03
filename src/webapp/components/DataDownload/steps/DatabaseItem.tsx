import { Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "../../Icons";
import { DatabaseSelection } from "../types";
import CloseIcon from "@mui/icons-material/Close";
import {
    diagnosisDatasetSuggestions,
    invasiveDatasetSuggestions,
    preventionDatasetSuggestions,
    treatmentDatasetSuggestions,
} from "../filters/DataSetSelector";

interface DatabaseItemProps {
    database: DatabaseSelection;
    onRemoveDatabase?: (id: number) => void;
    addDivider?: boolean;
}
export const DatabaseItem: React.FC<DatabaseItemProps> = ({ database, onRemoveDatabase, addDivider = false }) => {
    const { t } = useTranslation();

    const handleRemoveDatabase = React.useCallback(() => {
        if (onRemoveDatabase) {
            onRemoveDatabase(database.id);
        }
    }, [database.id, onRemoveDatabase]);

    const dataset = useMemo(() => {
        switch (database.kind) {
            case "prevention": {
                return preventionDatasetSuggestions.find(ds => ds.value === database.dataset).title;
            }
            case "diagnosis": {
                return diagnosisDatasetSuggestions.find(ds => ds.value === database.dataset).title;
            }
            case "invasive": {
                return invasiveDatasetSuggestions.find(ds => ds.value === database.dataset).title;
            }
            case "treatment": {
                return treatmentDatasetSuggestions.find(ds => ds.value === database.dataset).title;
            }
        }
    }, [database]);

    return (
        <React.Fragment>
            <Grid container spacing={4} sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Grid item xs={3.5}>
                    <ThemeValue database={database} />
                </Grid>
                <Grid item xs={7.5}>
                    <Stack direction="column" spacing={0}>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="caption" fontWeight="bold" color="primary" textTransform="uppercase">
                                {t("common.data_download.data_step.data_set")}
                            </Typography>
                            <Typography variant="caption">{t(dataset)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="caption" fontWeight="bold" color="primary" textTransform="uppercase">
                                {t("common.data_download.data_step.data")}
                            </Typography>
                            <Typography variant="caption">{t(database.filtersValue)}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="caption" fontWeight="bold" color="primary" textTransform="uppercase">
                                {t("common.data_download.data_step.location")}
                            </Typography>
                            <Typography variant="caption">{t(database.location)}</Typography>
                        </Stack>
                        <Typography variant="caption" color="GrayText">
                            {database.kind === "treatment"
                                ? t("common.data_download.data_step.studies_in_file", {
                                      total: database.filteredStudies.length,
                                  })
                                : t("common.data_download.data_step.bioassays_in_file", {
                                      total: database.filteredStudies.length,
                                  })}
                        </Typography>
                    </Stack>
                </Grid>
                {onRemoveDatabase && (
                    <Grid item xs={1}>
                        <IconButton onClick={handleRemoveDatabase} size="medium">
                            <CloseIcon sx={{ fontSize: 13 }} />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
            {addDivider && <Divider />}
        </React.Fragment>
    );
};

const ThemeValue: React.FC<{ database: DatabaseSelection }> = ({ database }) => {
    const { t } = useTranslation();

    switch (database.kind) {
        case "prevention": {
            return (
                <Stack direction="row" spacing={1} alignItems="center">
                    <PreventionIcon selected size={50} />
                    <Typography variant="body2" lineHeight={1.2} fontWeight="bold">
                        {t("common.themes.prevention")}
                    </Typography>
                </Stack>
            );
        }
        case "diagnosis": {
            return (
                <Stack direction="row" spacing={1}>
                    <DiagnosisIcon selected size={50} />
                    <Typography variant="body2" lineHeight={1.2} fontWeight="bold">
                        {t("common.themes.diagnosis")}
                    </Typography>
                </Stack>
            );
        }
        case "invasive": {
            return (
                <Stack direction="row" spacing={1}>
                    <InvasiveIcon selected size={50} />
                    <Typography variant="body2" lineHeight={1.2} fontWeight="bold">
                        {t("common.themes.invasive")}
                    </Typography>
                </Stack>
            );
        }
        case "treatment": {
            return (
                <Stack direction="row" spacing={1}>
                    <TreatmentIcon selected size={50} />
                    <Typography variant="body2" lineHeight={1.2} fontWeight="bold">
                        {t("common.themes.treatment")}
                    </Typography>
                </Stack>
            );
        }
    }
};
