import React from "react";
import { Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TableData } from "./TableData";

import { TableHeadCell } from "../../../../../../components/Report/TableHeadCell";
import { Order } from "../../../../../../components/Report/utils";
import { EnhancedTableProps, HeadCell, StyledCell, useStyles } from "../../../../../../components/Report/types";
import styled from "styled-components";
import _ from "lodash";

interface TreatmentOverTimeTableProps {
    rows: TableData[];
    plasmodiumSpecie?: string;
}

const TreatmentOverTimeTable: React.FC<TreatmentOverTimeTableProps> = ({ rows, plasmodiumSpecie }) => {
    const classes = useStyles({});
    const { t } = useTranslation();
    const [order, setOrder] = React.useState<Order>("desc");
    const [orderBy, setOrderBy] = React.useState<keyof TableData>("DRUG");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(20);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TableData) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedRows = _.orderBy(rows, ["COUNTRY", orderBy], ["asc", order]);

    const tablePage = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const finalRows: TableData[] = tablePage.map(row => ({
        ...row,
        COUNTRY_NUMBER: tablePage.filter(r => r.COUNTRY === row.COUNTRY).length,
    }));

    const filterColumnsToDisplay = ([field, _value]: [string, string]) =>
        !["ID", "COUNTRY", "COUNTRY_NUMBER", "ISO2"].includes(field);
    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Typography variant="h6" id="tableTitle" display="block" fontWeight="bold" gutterBottom>
                    {t("common.report.treatment.title")}
                    {plasmodiumSpecie && (
                        <>
                            <br />
                            <Typography variant="body1" id="tableTitle">
                                ({t(plasmodiumSpecie.replace(".", "%2E"))})
                            </Typography>
                        </>
                    )}
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
                            numSelected={0}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {finalRows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow tabIndex={-1} key={`${row.ID}_${row.ISO2}_${row.FOLLOW_UP}`}>
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
                                                const header = [...headCells, ...subheadCells].find(
                                                    cell => cell.id === field
                                                );
                                                const number = Number(value);
                                                const isNumber = !Number.isNaN(number);
                                                return (
                                                    <StyledCell
                                                        key={`${field}_${index}`}
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        isRight={header.dataAlign === "right"}
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
            </div>
        </div>
    );
};

export default React.memo(TreatmentOverTimeTable);

function EnhancedTableHead(props: EnhancedTableProps<TableData>) {
    const { classes, order, orderBy, onRequestSort } = props;
    const { t } = useTranslation();

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
                        rowSpan={headCell.rowSpan}
                        isBold
                    />
                ))}
                <StyledCell colSpan={subheadCells.length} align="center" isBold divider>
                    {t("common.report.treatment.percentage_patients_treatment_failure")}
                </StyledCell>
            </TableRow>
            <TableRow>
                {subheadCells.map(subHeadCell => (
                    <TableHeadCell
                        key={subHeadCell.id}
                        classes={classes}
                        headCell={subHeadCell}
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

const StyledTableContainer = styled(TableContainer)`
    height: 450px;
`;

const subheadCells: HeadCell<TableData>[] = [
    {
        id: "MEDIAN",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.median",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "MIN",
        numeric: true,
        disablePadding: false,
        label: "Min",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "MAX",
        numeric: true,
        disablePadding: false,
        label: "Max",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "PERCENTILE_25",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.percentile_25",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 2,
    },
    {
        id: "PERCENTILE_75",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.percentile_75",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 2,
    },
];

const headCells: HeadCell<TableData>[] = [
    {
        id: "COUNTRY",
        numeric: false,
        disablePadding: false,
        label: "common.report.treatment.country",
        rowSpan: 2,
        align: "center",
    },
    {
        id: "DRUG",
        numeric: false,
        disablePadding: false,
        divider: true,
        label: "common.report.treatment.drug",
        rowSpan: 2,
        align: "center",
    },
    {
        id: "FOLLOW_UP",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.follow",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 0,
        rowSpan: 2,
    },
    {
        id: "STUDY_YEARS",
        numeric: false,
        disablePadding: false,
        label: "common.report.treatment.period",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        rowSpan: 2,
    },
    {
        id: "NUMBER_OF_STUDIES",
        numeric: true,
        disablePadding: false,
        label: "common.report.treatment.studies",
        sortable: true,
        align: "center",
        dataAlign: "right",
        divider: true,
        decimalPositions: 0,
        rowSpan: 2,
    },
];
