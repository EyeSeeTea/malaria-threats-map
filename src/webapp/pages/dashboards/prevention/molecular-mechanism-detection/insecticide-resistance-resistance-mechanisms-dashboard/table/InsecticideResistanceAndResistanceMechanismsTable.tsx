import React from "react";
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import * as R from "ramda";
import { useTranslation } from "react-i18next";

import { TableHeadCell } from "../../../../../../components/Report/TableHeadCell";
import { getComparator, Order, stableSort } from "../../../../../../components/Report/utils";
import { EnhancedTableProps, HeadCell, StyledCell, useStyles } from "../../../../../../components/Report/types";
import { TableData } from "./TableData";
import styled from "styled-components";

interface InsecticideResistanceAndResistanceMechanismTableProps {
    rows: TableData[];
}

const InsecticideResistanceAndResistanceMechanismsTable: React.FC<
    InsecticideResistanceAndResistanceMechanismTableProps
> = ({ rows }) => {
    const classes = useStyles({});
    const { t } = useTranslation();
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<keyof TableData>("PYRETHROIDS_AVERAGE_MORTALITY");
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

    const sortedGroups = R.sort(
        (a, b) =>
            t(a.ISO2 === "NA" ? "common.COUNTRY_NA" : a.ISO2) < t(b.ISO2 === "NA" ? "common.COUNTRY_NA" : b.ISO2)
                ? -1
                : 1,
        rows
    );

    const tablePage = stableSort(sortedGroups, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const finalRows: TableData[] = tablePage.map(row => ({
        ...row,
        COUNTRY_NUMBER: tablePage.filter(r => r.ISO2 === row.ISO2).length,
    }));

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Typography variant="h6" id="tableTitle" display="block" fontWeight="bold" gutterBottom>
                    {t("common.report.prevention.title")}
                </Typography>

                <StyledTableContainer>
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
                                                const active2 = (row as any)[`${entry[0]}_NUMBER_SITES`];
                                                const finalActive = active !== undefined ? active : active2;

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
                                                            ? `${number.toFixed(1)}% ${
                                                                  finalActive !== undefined ? `(${finalActive})` : ""
                                                              }`
                                                            : entry[1] || "-"}
                                                    </StyledCell>
                                                );
                                            })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Typography variant={"body2"}>{t("common.data_download.footer")}</Typography>
                <br />
            </div>
        </div>
    );
};

export default InsecticideResistanceAndResistanceMechanismsTable;

const StyledTableContainer = styled(TableContainer)`
    height: 450px;
`;

function EnhancedTableHead(props: EnhancedTableProps<TableData>) {
    const { t } = useTranslation();
    const { classes, order, orderBy, onRequestSort } = props;

    return (
        <TableHead>
            <TableRow>
                <StyledCell isBold colSpan={3} />
                <StyledCell isBold colSpan={8} divider>
                    {t("common.report.prevention.resistance")}
                </StyledCell>
                <StyledCell isBold colSpan={7} divider>
                    {t("common.report.prevention.mechanism")}
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

export const ERROR_COLUMNS = [
    "PYRETHROIDS_AVERAGE_MORTALITY",
    "ORGANOCHLORINES_AVERAGE_MORTALITY",
    "CARBAMATES_AVERAGE_MORTALITY",
    "ORGANOPHOSPHATES_AVERAGE_MORTALITY",
];

export const GREY_COLUMNS = [
    "MONOXYGENASES_PERCENT_SITES_DETECTED",
    "ESTERASES_PERCENT_SITES_DETECTED",
    "GSTS_PERCENT_SITES_DETECTED",
    "K1014S_PERCENT_SITES_DETECTED",
    "K1014F_PERCENT_SITES_DETECTED",
    "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED",
    "ACE1R_PERCENT_SITES_DETECTED",
];

export const COLUMNS = [
    "ID",
    "INSECTICIDE_CLASSES",
    "COUNTRY",
    "COUNTRY_NUMBER",
    "ISO2",
    "PYRETHROIDS_N",
    "ORGANOCHLORINES_N",
    "CARBAMATES_N",
    "ORGANOPHOSPHATES_N",
    "MONOXYGENASES_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "ESTERASES_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "GSTS_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "K1014S_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "K1014F_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED_NUMBER_SITES",
    "ACE1R_PERCENT_SITES_DETECTED_NUMBER_SITES",
];

export const headCells: HeadCell<TableData>[] = [
    {
        id: "COUNTRY",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.country",
    },
    {
        id: "INSECTICIDE_CLASSES",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.insecticide",
        align: "center",
        divider: true,
    },
    {
        id: "SPECIES",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.species",
        divider: true,
    },
    {
        id: "PYRETHROIDS_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "PYRETHROIDS_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "ORGANOCHLORINES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "ORGANOCHLORINES_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "CARBAMATES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "CARBAMATES_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "ORGANOPHOSPHATES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
        sortable: true,
        align: "right",
        divider: true,
    },
    {
        id: "ORGANOPHOSPHATES_LAST_YEAR",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.resistance_year",
        sortable: true,
        align: "right",
    },
    {
        id: "MONOXYGENASES_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
        divider: true,
    },
    {
        id: "ESTERASES_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "GSTS_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "K1014S_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "K1014F_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
    },
    {
        id: "ACE1R_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
        align: "right",
    },
];
