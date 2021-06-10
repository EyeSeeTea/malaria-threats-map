import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import FilterListIcon from "@material-ui/icons/FilterList";
import CountriesSelector from "../../DataDownload/filters/CountriesSelector";
import SpeciesSelector from "../../filters/SpeciesSelector";
import T from "../../../translations/T";

const useStyles = makeStyles(() =>
    createStyles({
        paper: {
            minWidth: 400,
            overflowY: "unset",
            overflowX: "unset",
        },
    })
);

export default function FilterPopover({ countries, setCountries, species, setSpecies }: any) {
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
                <CountriesSelector onChange={setCountries} value={countries} />
                <SpeciesSelector onChange={setSpecies} value={species} />
            </Popover>
        </div>
    );
}
