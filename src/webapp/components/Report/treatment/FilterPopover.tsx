import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import CountriesSelector from "../../DataDownload/filters/CountriesSelector";
import T from "../../../translations/T";
import DrugsSelector from "../../filters/DrugsSelector";
import PlasmodiumSpecieSelector from "../../filters/PlasmodiumSpecieSelector";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            minWidth: 400,
            overflowY: "unset",
            overflowX: "unset",
        },
        typography: {
            padding: theme.spacing(2),
        },
    })
);

interface Props {
    countries: string[];
    setCountries: any;
    drugs: string[];
    setDrugs: any;
    plasmodiumSpecie: string;
    setPlasmodiumSpecie: any;
}

export default function FilterPopover({
    countries,
    setCountries,
    drugs,
    setDrugs,
    plasmodiumSpecie,
    setPlasmodiumSpecie,
}: Props) {
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
                <T i18nKey={"filters.filters"} />
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
                <PlasmodiumSpecieSelector onChange={setPlasmodiumSpecie} value={plasmodiumSpecie} />
                <DrugsSelector onChange={setDrugs} value={drugs} />
                <CountriesSelector onChange={setCountries} value={countries} />
            </Popover>
        </div>
    );
}
