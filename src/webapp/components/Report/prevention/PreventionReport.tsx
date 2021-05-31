import React from "react";
import clsx from "clsx";
import { createStyles, lighten, makeStyles, Theme } from "@material-ui/core/styles";
import {
    Button,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Typography,
    Paper,
    IconButton,
    Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import { selectPreventionStudies } from "../../../store/reducers/prevention-reducer";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { COLUMNS, Data, ERROR_COLUMNS, GREY_COLUMNS, headCells } from "./columns";
import { resolvePyrethroids } from "../resolvers/resistanceStatus";
import { resolveMechanism } from "../resolvers/resistanceMechanism";
import FilterPopover from "./FilterPopover";
import { filterByCountries, filterBySpecies } from "../../layers/studies-filters";
import { exportToCSV } from "../../DataDownload/download";
import { format } from "date-fns";
import { getComparator, Order, stableSort } from "../utils";
import { StyledCell, useStyles, EnhancedTableProps } from "../types";
import { sendAnalytics } from "../../../utils/analytics";
import { PreventionStudy } from "../../../../domain/entities/PreventionStudy";
import { TableHeadCell } from "../TableHeadCell";

function EnhancedTableHead(props: EnhancedTableProps<Data>) {
    const { t } = useTranslation("common");
    const { classes, order, orderBy, onRequestSort } = props;

    return (
        <TableHead>
            <TableRow>
                <StyledCell isBold colSpan={3} />
                <StyledCell isBold colSpan={8} divider>
                    {t("report.prevention.resistance")}
                </StyledCell>
                <StyledCell isBold colSpan={7} divider>
                    {t("report.prevention.mechanism")}
                </StyledCell>
            </TableRow>
            <TableRow>
                <StyledCell isBold colSpan={3} />
                <StyledCell isBold colSpan={2} divider>
                    Pyrethroids
                </StyledCell>
                <StyledCell isBold colSpan={2}>
                    Organochlorines
                </StyledCell>
                <StyledCell isBold colSpan={2}>
                    Carbamates
                </StyledCell>
                <StyledCell isBold colSpan={2}>
                    Organophosphates
                </StyledCell>
                <StyledCell isBold colSpan={1} divider>
                    Mono oxygenases
                </StyledCell>
                <StyledCell isBold colSpan={1}>
                    Esterases
                </StyledCell>
                <StyledCell isBold colSpan={1}>
                    GSTs
                </StyledCell>
                <StyledCell isBold colSpan={1}>
                    kdr (K1014S)
                </StyledCell>
                <StyledCell isBold colSpan={1}>
                    kdr (K1014F)
                </StyledCell>
                <StyledCell isBold colSpan={1}>
                    kdr (unspecified mutation)
                </StyledCell>
                <StyledCell isBold colSpan={1}>
                    Ace-1R
                </StyledCell>
            </TableRow>
            <TableRow>
                {headCells.map(headCell => (
                    <TableHeadCell
                        key={headCell.id}
                        classes={classes}
                        headCell={headCell}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={onRequestSort}
                    />
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
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

interface EnhancedTableToolbarProps {
    numSelected: number;
    countries: string[];
    setCountries: any;
    species: string[];
    setSpecies: any;
    onClick: any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { t } = useTranslation("common");
    const classes = useToolbarStyles({});
    const { numSelected, countries, setCountries, species, setSpecies, onClick } = props;

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
                    {t("report.prevention.title")}
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
                    <FilterPopover
                        countries={countries}
                        setCountries={setCountries}
                        species={species}
                        setSpecies={setSpecies}
                    />
                </>
            )}
        </Toolbar>
    );
};

const mapStateToProps = (state: State) => ({
    studies: selectPreventionStudies(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {};
type Props = StateProps & OwnProps;

function PreventionReport({ studies: baseStudies }: Props) {
    const classes = useStyles({});
    const { t } = useTranslation("common");
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("PYRETHROIDS_AVERAGE_MORTALITY");
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [countries, doSetCountries] = React.useState<string[]>([]);
    const [species, doSetSpecies] = React.useState<string[]>([]);

    const setCountries = (countries: string[]) => {
        doSetCountries(countries);

        setPage(0);
    };

    const setSpecies = (species: string[]) => {
        doSetSpecies(species);
        setPage(0);
    };

    const filters = [filterByCountries(countries), filterBySpecies(species)];

    const studies = filters.reduce((studies, filter) => studies.filter(filter), baseStudies);

    const countryStudyGroups = R.groupBy((study: PreventionStudy) => `${study.ISO2}`, studies);

    const groups: Data[] = R.flatten(
        Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
            const countrySpeciesGroup = R.groupBy((study: PreventionStudy) => `${study.SPECIES}`, countryStudies);

            const insecticideClasses = R.uniqBy(
                study => study.INSECTICIDE_CLASS,
                countryStudies.filter(study => parseFloat(study.MORTALITY_ADJUSTED) < 0.9)
            );

            const entries = Object.entries(countrySpeciesGroup);
            return entries
                .map(([species, countrySpeciesStudies]) => {
                    const {
                        percentage: pyrethroidsPercentage,
                        sorted: sortedPyrethroidsStudies,
                        n: pyrethroidsStudies,
                    } = resolvePyrethroids("PYRETHROIDS", countrySpeciesStudies);
                    const {
                        percentage: organochlorinesPercentage,
                        sorted: sortedOrganochlorinesStudies,
                        n: organochlorinesStudies,
                    } = resolvePyrethroids("ORGANOCHLORINES", countrySpeciesStudies);
                    const {
                        percentage: carbamatesPercentage,
                        sorted: sortedCarbamatesStudies,
                        n: carbamatesStudies,
                    } = resolvePyrethroids("CARBAMATES", countrySpeciesStudies);
                    const {
                        percentage: organophosphatesPercentage,
                        sorted: sortedOrganophosphatesStudies,
                        n: organophosphatesStudies,
                    } = resolvePyrethroids("ORGANOPHOSPHATES", countrySpeciesStudies);

                    const { percentage: monoOxygenases, n: monoOxygenasesNumber } = resolveMechanism(
                        "MONO_OXYGENASES",
                        countrySpeciesStudies
                    );
                    const { percentage: esterases, n: esterasesNumber } = resolveMechanism(
                        "ESTERASES",
                        countrySpeciesStudies
                    );
                    const { percentage: gsts, n: gstsNumber } = resolveMechanism("GSTS", countrySpeciesStudies);
                    const { percentage: kdrL1014s, n: kdrL1014sNumber } = resolveMechanism(
                        "KDR_L1014S",
                        countrySpeciesStudies
                    );
                    const { percentage: kdrL1014f, n: kdrL1014fNumber } = resolveMechanism(
                        "KDR_L1014F",
                        countrySpeciesStudies
                    );
                    const { percentage: kdrUnspecified, n: kdrUnspecifiedNumber } = resolveMechanism(
                        "KDR_(MUTATION_UNSPECIFIED)",
                        countrySpeciesStudies
                    );
                    const { percentage: ace1r, n: ace1rNumber } = resolveMechanism("ACE1R", countrySpeciesStudies);

                    return {
                        ID: `${country}_${species}`,
                        ISO2: country,
                        COUNTRY: t(country),
                        COUNTRY_NUMBER: entries.length,
                        SPECIES: species,
                        INSECTICIDE_CLASSES: `${insecticideClasses.length}`,
                        PYRETHROIDS_AVERAGE_MORTALITY: pyrethroidsPercentage,
                        PYRETHROIDS_LAST_YEAR: `${
                            sortedPyrethroidsStudies.length ? sortedPyrethroidsStudies[0].YEAR_START : "-"
                        }`,
                        PYRETHROIDS_N: pyrethroidsStudies,
                        ORGANOCHLORINES_AVERAGE_MORTALITY: organochlorinesPercentage,
                        ORGANOCHLORINES_LAST_YEAR: `${
                            sortedOrganochlorinesStudies.length ? sortedOrganochlorinesStudies[0].YEAR_START : "-"
                        }`,

                        ORGANOCHLORINES_N: organochlorinesStudies,
                        CARBAMATES_AVERAGE_MORTALITY: carbamatesPercentage,
                        CARBAMATES_LAST_YEAR: `${
                            sortedCarbamatesStudies.length ? sortedCarbamatesStudies[0].YEAR_START : "-"
                        }`,
                        CARBAMATES_N: carbamatesStudies,
                        ORGANOPHOSPHATES_AVERAGE_MORTALITY: organophosphatesPercentage,
                        ORGANOPHOSPHATES_LAST_YEAR: `${
                            sortedOrganophosphatesStudies.length ? sortedOrganophosphatesStudies[0].YEAR_START : "-"
                        }`,
                        ORGANOPHOSPHATES_N: organophosphatesStudies,
                        MONOXYGENASES_PERCENT_SITES_DETECTED: monoOxygenases,
                        MONOXYGENASES_PERCENT_SITES_DETECTED_NUMBER_SITES: monoOxygenasesNumber,
                        ESTERASES_PERCENT_SITES_DETECTED: esterases,
                        ESTERASES_PERCENT_SITES_DETECTED_NUMBER_SITES: esterasesNumber,
                        GSTS_PERCENT_SITES_DETECTED: gsts,
                        GSTS_PERCENT_SITES_DETECTED_NUMBER_SITES: gstsNumber,
                        K1014S_PERCENT_SITES_DETECTED: kdrL1014s,
                        K1014S_PERCENT_SITES_DETECTED_NUMBER_SITES: kdrL1014sNumber,
                        K1014F_PERCENT_SITES_DETECTED: kdrL1014f,
                        K1014F_PERCENT_SITES_DETECTED_NUMBER_SITES: kdrL1014fNumber,
                        KDR_UNSPECIFIED_PERCENT_SITES_DETECTED: kdrUnspecified,
                        KDR_UNSPECIFIED_PERCENT_SITES_DETECTED_NUMBER_SITES: kdrUnspecifiedNumber,
                        ACE1R_PERCENT_SITES_DETECTED: ace1r,
                        ACE1R_PERCENT_SITES_DETECTED_NUMBER_SITES: ace1rNumber,
                    };
                })
                .sort(getComparator(order, orderBy));
        })
    );

    const downloadData = () => {
        const studies = R.map(
            group =>
                Object.entries(group).reduce((acc, [field, value]) => {
                    if (field === "ID") {
                        return acc;
                    } else {
                        return {
                            ...acc,
                            [field]: (typeof value === "number" && isNaN(value)) || value === "-" ? "" : value,
                        };
                    }
                }, {}),
            groups
        );
        const tabs = [
            {
                name: "Data",
                studies: studies,
            },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_PREVENTION_${dateString}`);
        sendAnalytics({
            type: "event",
            category: "tableView",
            action: "download",
            label: "prevention",
        });
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setPage(0);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = groups.map(n => n.ID);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const sortedGroups = R.sort(
        (a, b) => (t(a.ISO2 === "NA" ? "COUNTRY_NA" : a.ISO2) < t(b.ISO2 === "NA" ? "COUNTRY_NA" : b.ISO2) ? -1 : 1),
        groups
    );

    const tablePage = stableSort(sortedGroups, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const rows: Data[] = tablePage.map(row => ({
        ...row,
        COUNTRY_NUMBER: tablePage.filter(r => r.ISO2 === row.ISO2).length,
    }));

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.wrapper}>
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        countries={countries}
                        setCountries={setCountries}
                        species={species}
                        setSpecies={setSpecies}
                        onClick={downloadData}
                    />
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={"small"}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={groups.length}
                            />
                            <TableBody>
                                {rows.map((row, index) => {
                                    const isItemSelected = isSelected(row.ID);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow tabIndex={-1} key={row.ID} selected={isItemSelected}>
                                            {(index === 0 || tablePage[index].ISO2 !== tablePage[index - 1].ISO2) && (
                                                <>
                                                    <StyledCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        rowSpan={row.COUNTRY_NUMBER}
                                                        align={"left"}
                                                    >
                                                        {row.COUNTRY}
                                                    </StyledCell>
                                                    <StyledCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        rowSpan={row.COUNTRY_NUMBER}
                                                        align={"center"}
                                                        divider={true}
                                                    >
                                                        {row.INSECTICIDE_CLASSES}
                                                    </StyledCell>
                                                </>
                                            )}
                                            {Object.entries(row)
                                                .filter(entry => !COLUMNS.includes(entry[0]))
                                                .map((entry, index) => {
                                                    const number = Number(entry[1]);
                                                    const header = headCells.find(cell => cell.id === entry[0]);
                                                    const isNumber = !Number.isNaN(number);
                                                    const percentage = ERROR_COLUMNS.includes(entry[0]);
                                                    const cell = entry[0].split("_")[0];
                                                    const active = (row as any)[`${cell}_N`];
                                                    const error =
                                                        percentage && entry[0].indexOf("AVERAGE") > -1 && number > 0;
                                                    const grey = GREY_COLUMNS.includes(entry[0]);
                                                    const darkGrey =
                                                        grey && (row as any)[`${entry[0]}_NUMBER_SITES`] > 0
                                                            ? "dimgrey"
                                                            : "darkgray";
                                                    return (
                                                        <StyledCell
                                                            key={`${entry[0]}_${index}`}
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                            color={error ? "red" : grey ? darkGrey : undefined}
                                                            isRight={header.align === "right"}
                                                            divider={header.divider}
                                                        >
                                                            {header && header.numeric && isNumber
                                                                ? `${number.toFixed(1)}% ${active ? `(${active})` : ""}`
                                                                : entry[1] || "-"}
                                                        </StyledCell>
                                                    );
                                                })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={groups.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                    <Typography variant={"body2"}>{t("data_download.footer")}</Typography>
                    <br />
                </div>
            </Paper>
        </div>
    );
}

export default connect(mapStateToProps)(PreventionReport);
