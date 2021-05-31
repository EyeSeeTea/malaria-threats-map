import {
    createStyles,
    lighten,
    makeStyles,
    Theme,
    Button,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import React from "react";
import ReportFilterPopover from "./ReportFilterPopover";

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
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === "light"
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
}) => {
    const { t } = useTranslation("common");
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
                    <IconButton aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                // <div />
                <>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<CloudDownloadIcon />}
                        onClick={onClick}
                    >
                        {t("data_download.buttons.download")}
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
                    />
                </>
            )}
        </Toolbar>
    );
};

export default ReportToolbar;
