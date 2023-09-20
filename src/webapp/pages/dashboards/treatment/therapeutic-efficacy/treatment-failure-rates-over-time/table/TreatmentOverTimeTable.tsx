import React from "react";
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { TableData, headCells } from "./TableData";

import { format } from "date-fns";

import ReportToolbar from "../../../../../../components/Report/ReportToolbar";
import { exportToCSV } from "../../../../../../components/DataDownload/download";
import { TableHeadCell } from "../../../../../../components/Report/TableHeadCell";
import { sendAnalytics } from "../../../../../../utils/analytics";
import { getComparator, Order, stableSort } from "../../../../../../components/Report/utils";
import { EnhancedTableProps, StyledCell, useStyles } from "../../../../../../components/Report/types";

interface TreatmentOverTimeTableProps {
    rows: TableData[];
}

const TreatmentOverTimeTable: React.FC<TreatmentOverTimeTableProps> = ({ rows }) => {
    const classes = useStyles({});
    const { t } = useTranslation();
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<keyof TableData>("DRUG");
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

    const downloadData = () => {
        const studies = R.map(group => {
            const study = { ...group };
            delete study.ID;
            delete study.COUNTRY_NUMBER;
            return study;
        }, rows);
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

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TableData) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setPage(0);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.ID);
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

    const sortedGroups = R.sort((a, b) => (t(`common.${a.COUNTRY}`) < t(`common.${b.COUNTRY}`) ? -1 : 1), rows);

    const tablePage = stableSort(sortedGroups, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    const finalRows: TableData[] = tablePage.map(row => ({
        ...row,
        COUNTRY_NUMBER: tablePage.filter(r => r.COUNTRY === row.COUNTRY).length,
    }));

    const filterColumnsToDisplay = ([field, _value]: [string, string]) =>
        !["ID", "COUNTRY", "COUNTRY_NUMBER", "ISO2"].includes(field);
    return (
        <div className={classes.root}>
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
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {finalRows.map((row, index) => {
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
                                                        isRight={header.align === "right"}
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
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>
    );
};

export default React.memo(TreatmentOverTimeTable);

function EnhancedTableHead(props: EnhancedTableProps<TableData>) {
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
