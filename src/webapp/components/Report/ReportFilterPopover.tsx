import React from "react";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import CountriesSelector from "../DataDownload/filters/CountriesSelector";
import T from "../../translations/T";
import DrugsSelector from "../filters/DrugsSelector";
import PlasmodiumSpecieSelector from "../filters/PlasmodiumSpecieSelector";
import SpeciesSelector from "../filters/SpeciesSelector";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";

const useStyles = makeStyles(() =>
    createStyles({
        paper: {
            minWidth: 400,
            overflowY: "unset",
            overflowX: "unset",
        },
    })
);

interface Props {
    countries: string[];
    setCountries: any;
    drugs?: string[];
    setDrugs?: any;
    plasmodiumSpecie?: string;
    setPlasmodiumSpecie?: any;
    species?: string[];
    setSpecies?: any;
    treatmentStudies?: TreatmentStudy[];
}

const ReportFilterPopover: React.FC<Props> = ({
    countries,
    setCountries,
    drugs,
    setDrugs,
    plasmodiumSpecie,
    setPlasmodiumSpecie,
    species,
    setSpecies,
    treatmentStudies,
}) => {
    const classes = useStyles({});
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div>
            <Button
                aria-describedby={id}
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon />}
                onClick={handleClick}
            >
                <T i18nKey={"common.filters.filters"} />
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                PaperProps={{ className: classes.paper }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                {plasmodiumSpecie && setPlasmodiumSpecie && (
                    <PlasmodiumSpecieSelector onChange={setPlasmodiumSpecie} value={plasmodiumSpecie} />
                )}
                {drugs && setDrugs && <DrugsSelector studies={treatmentStudies} onChange={setDrugs} value={drugs} />}

                <CountriesSelector onChange={setCountries} value={countries} />

                {species && setSpecies && <SpeciesSelector onChange={setSpecies} value={species} />}
            </Popover>
        </div>
    );
};

export default ReportFilterPopover;
