import { lighten, Theme, Button, Toolbar, Typography, IconButton, Tooltip } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import React from "react";
import ReportFilterPopover from "./ReportFilterPopover";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";

interface ReportToolbarProps {
    title: string;
    subtitle?: string;
    numSelected: number;
    countries: string[];
    setCountries: any;
    species?: string[];
    setSpecies?: any;
    drugs?: string[];
    setDrugs?: any;
    plasmodiumSpecie?: string;
    setPlasmodiumSpecie?: any;
    onClick: any;
    preventionStudies?: PreventionStudy[];
    treatmentStudies?: TreatmentStudy[];
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.mode === "light"
                ? {
                      color: theme.palette.secondary.main,
                      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                  }
                : {
                      color: theme.palette.text.primary,
                      backgroundColor: theme.palette.secondary.dark,
                  },
        title: {
            flex: "1 1 100%",
        },
        button: {
            margin: theme.spacing(1),
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
    })
);

const ReportToolbar: React.FC<ReportToolbarProps> = ({
    title,
    subtitle,
    numSelected,
    countries,
    setCountries,
    species,
    setSpecies,
    drugs,
    setDrugs,
    plasmodiumSpecie,
    setPlasmodiumSpecie,
    onClick,
    preventionStudies,
    treatmentStudies,
}) => {
    const { t } = useTranslation();
    const classes = useToolbarStyles({});

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle">
                    {title}
                    {subtitle && (
                        <>
                            <br />
                            <Typography variant="body1" id="tableTitle">
                                ({subtitle})
                            </Typography>
                        </>
                    )}
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton aria-label="delete" size="large">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                // <div />
                <>
                    <Button
                        variant="contained"
                        className={classes.button}
                        startIcon={<CloudDownloadIcon />}
                        onClick={onClick}
                    >
                        {t("common.data_download.buttons.download")}
                    </Button>
                    <ReportFilterPopover
                        countries={countries}
                        setCountries={setCountries}
                        species={species}
                        setSpecies={setSpecies}
                        drugs={drugs}
                        setDrugs={setDrugs}
                        plasmodiumSpecie={plasmodiumSpecie}
                        setPlasmodiumSpecie={setPlasmodiumSpecie}
                        treatmentStudies={treatmentStudies}
                        preventionStudies={preventionStudies}
                    />
                </>
            )}
        </Toolbar>
    );
};

export default ReportToolbar;
