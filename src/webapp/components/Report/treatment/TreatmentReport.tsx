import React from "react";
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Paper } from "@mui/material";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { Data, headCells } from "./columns";
import {
    filterByCountries,
    filterByDrugs,
    filterByPlasmodiumSpecies,
    filterByMolecularMarkerStudyDimension256,
} from "../../layers/studies-filters";
import { exportToCSV } from "../../DataDownload/download";
import { getComparator, Order, percentile, stableSort } from "../utils";
import { selectTreatmentStudies } from "../../../store/reducers/treatment-reducer";
import { EnhancedTableProps, StyledCell, useStyles } from "../types";
import { isNotNull } from "../../../utils/number-utils";
import { format } from "date-fns";
import { sendAnalytics } from "../../../utils/analytics";
import { TreatmentStudy } from "../../../../domain/entities/TreatmentStudy";
import { TableHeadCell } from "../TableHeadCell";
import ReportToolbar from "../ReportToolbar";

function EnhancedTableHead(props: EnhancedTableProps<Data>) {
    const { classes, order, orderBy, onRequestSort } = props;

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableHeadCell
                        key={headCell.id}
                        classes={classes}
                        headCell={headCell}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={onRequestSort}
                        isBold
                    />
                ))}
            </TableRow>
        </TableHead>
    );
}

const mapStateToProps = (state: State) => ({
    studies: selectTreatmentStudies(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {};
type Props = StateProps & OwnProps;

function TreatmentReport({ studies: baseStudies }: Props) {
    const classes = useStyles({});
    const { t } = useTranslation();
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("DRUG");
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

    const [countries, doSetCountries] = React.useState<string[]>([]);
    const [drugs, doSetDrugs] = React.useState<string[]>([]);
    const [plasmodiumSpecie, doSetPlasmodiumSpecie] = React.useState<string>("P._FALCIPARUM");

    const setCountries = (countries: string[]) => {
        doSetCountries(countries);
        setPage(0);
    };

    const setDrugs = (species: string[]) => {
        doSetDrugs(species);
        setPage(0);
    };

    const setPlasmodiumSpecie = (specie: string) => {
        doSetPlasmodiumSpecie(specie);
        setPage(0);
    };

    const filters = [
        (study: TreatmentStudy) => isNotNull(study.DRUG_NAME),
        filterByMolecularMarkerStudyDimension256(),
        filterByPlasmodiumSpecies([plasmodiumSpecie]),
        filterByCountries(countries),
        filterByDrugs(drugs),
    ];

    const studies = filters.reduce((studies, filter) => studies.filter(filter), baseStudies);

    const countryStudyGroups = R.groupBy((study: TreatmentStudy) => `${study.ISO2}`, studies);

    const groups: Data[] = R.flatten(
        Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
            const countrySpeciesGroup = R.groupBy((study: TreatmentStudy) => `${study.DRUG_NAME}`, countryStudies);
            const entries = Object.entries(countrySpeciesGroup);
            let nStudies = 0;
            return R.flatten(
                entries.map(([drug, countrySpeciesStudies]) => {
                    const followUpCountrySpeciesGroup = R.groupBy(
                        (study: TreatmentStudy) => `${study.FOLLOW_UP}`,
                        countrySpeciesStudies
                    );

                    const followUpCountrySpeciesGroupStudies = Object.entries(followUpCountrySpeciesGroup);
                    nStudies += followUpCountrySpeciesGroupStudies.length;
                    return followUpCountrySpeciesGroupStudies
                        .map(([followUpDays, followUpCountrySpeciesStudies]) => {
                            const yearSortedStudies = followUpCountrySpeciesStudies
                                .map((study: TreatmentStudy) => parseInt(study.YEAR_START))
                                .sort();
                            const minYear = yearSortedStudies[0];
                            const maxYear = yearSortedStudies[yearSortedStudies.length - 1];

                            const defaultProp = "TREATMENT_FAILURE_PP";
                            const fallbackProp = "TREATMENT_FAILURE_KM";

                            const rawValues = followUpCountrySpeciesStudies.map((study: TreatmentStudy) =>
                                study[defaultProp] !== null ? study[defaultProp] : study[fallbackProp]
                            );

                            const values = rawValues.filter(value => !Number.isNaN(value));
                            const sortedValues = values.sort();

                            const min = values.length ? sortedValues[0] * 100 : "-";
                            const max = values.length ? sortedValues[values.length - 1] * 100 : "-";
                            const median = values.length ? R.median(sortedValues) * 100 : "-";
                            const percentile25 = values.length ? percentile(sortedValues, 0.25) * 100 : "-";
                            const percentile75 = values.length ? percentile(sortedValues, 0.75) * 100 : "-";

                            return {
                                ID: `${country}_${drug}`,
                                COUNTRY: t(`COUNTRY_NAME.${country}`),
                                ISO2: country,
                                DRUG: t(drug),
                                COUNTRY_NUMBER: nStudies,
                                FOLLOW_UP: followUpDays,
                                STUDY_YEARS: `${minYear} - ${maxYear}`,
                                NUMBER_OF_STUDIES: followUpCountrySpeciesStudies.length,
                                MEDIAN: median,
                                MIN: min,
                                MAX: max,
                                PERCENTILE_25: percentile25,
                                PERCENTILE_75: percentile75,
                            };
                        })
                        .sort(getComparator(order, orderBy));
                })
            );
        })
    );

    const downloadData = () => {
        const studies = R.map(group => {
            const study = { ...group };
            delete study.ID;
            delete study.COUNTRY_NUMBER;
            return study;
        }, groups);
        const tabs = [
            {
                name: "Data",
                studies: studies,
            },
        ];
        const dateString = format(new Date(), "yyyyMMdd");
        exportToCSV(tabs, `MTM_TREATMENT_${dateString}`);
        sendAnalytics({
            type: "event",
            category: "tableView",
            action: "download",
            label: "treatment",
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

    const sortedGroups = R.sort((a, b) => (t(`common.${a.COUNTRY}`) < t(`common.${b.COUNTRY}`) ? -1 : 1), groups);

    const tablePage = stableSort(sortedGroups, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    const rows: Data[] = tablePage.map(row => ({
        ...row,
        COUNTRY_NUMBER: tablePage.filter(r => r.COUNTRY === row.COUNTRY).length,
    }));

    const filterColumnsToDisplay = ([field, _value]: [string, string]) =>
        !["ID", "COUNTRY", "COUNTRY_NUMBER", "ISO2"].includes(field);
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.wrapper}>
                    <ReportToolbar
                        title={t("common.report.treatment.title")}
                        subtitle={t(plasmodiumSpecie.replace(".", "%2E"))}
                        numSelected={selected.length}
                        countries={countries}
                        setCountries={setCountries}
                        drugs={drugs}
                        setDrugs={setDrugs}
                        plasmodiumSpecie={plasmodiumSpecie}
                        setPlasmodiumSpecie={setPlasmodiumSpecie}
                        onClick={() => downloadData()}
                        treatmentStudies={studies}
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
                                        <TableRow
                                            tabIndex={-1}
                                            key={`${row.ID}_${row.ISO2}_${row.FOLLOW_UP}`}
                                            selected={isItemSelected}
                                        >
                                            {(index === 0 || tablePage[index].ISO2 !== tablePage[index - 1].ISO2) && (
                                                <>
                                                    <StyledCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        rowSpan={row.COUNTRY_NUMBER}
                                                    >
                                                        {row.COUNTRY}
                                                    </StyledCell>
                                                </>
                                            )}
                                            {Object.entries(row)
                                                .filter(filterColumnsToDisplay)
                                                .map(([field, value]) => {
                                                    const header = headCells.find(cell => cell.id === field);
                                                    const number = Number(value);
                                                    const isNumber = !Number.isNaN(number);
                                                    return (
                                                        <StyledCell
                                                            key={`${field}_${index}`}
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                            $isRight={header.align === "right"}
                                                            divider={header.divider}
                                                        >
                                                            {header && header.numeric && isNumber
                                                                ? `${number.toFixed(header.decimalPositions | 0)}`
                                                                : value || "-"}
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
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </Paper>
        </div>
    );
}

export default connect(mapStateToProps)(TreatmentReport);
