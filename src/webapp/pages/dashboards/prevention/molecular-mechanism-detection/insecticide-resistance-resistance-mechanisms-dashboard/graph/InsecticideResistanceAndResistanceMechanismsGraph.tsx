import React from "react";
import { Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import { HeadCell, StyledCell, useStyles } from "../../../../../../components/Report/types";

import { GraphData } from "./GraphData";

const insecticideClassColors = [
    { start: 0, end: 0, color: "#869d68" },
    { start: 1, end: 19, color: "#ffa900" },
    { start: 20, end: 39, color: "#fe9b04" },
    { start: 40, end: 59, color: "#fc7e0d" },
    { start: 60, end: 79, color: "#f95b0c" },
    { start: 80, end: 100, color: "#f40a0a" },
];

const resistanceMecanishmColors = [
    { start: 0, end: 0, color: "#869d68" },
    { start: 1, end: 100, color: "#f40a0a" },
];

interface InsecticideResistanceAndResistanceMechanismTableProps {
    series: GraphData[];
}

const InsecticideResistanceAndResistanceMechanismsGraph: React.FC<
    InsecticideResistanceAndResistanceMechanismTableProps
> = ({ series }) => {
    const classes = useStyles({});

    const finalRows = series.map(row => ({
        ...row,
        COUNTRY_INDEX: series.filter(r => r.ISO2 === row.ISO2).indexOf(row),
        COUNTRY_NUMBER: series.filter(r => r.ISO2 === row.ISO2).length,
    }));

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={"small"}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead />
                        <TableBody>
                            {finalRows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                    <TableRow tabIndex={-1} key={row.ID} style={{ border: "0px" }}>
                                        {(index === 0 || series[index].ISO2 !== series[index - 1].ISO2) && (
                                            <>
                                                <StyledCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    rowSpan={row.COUNTRY_NUMBER}
                                                    align={"left"}
                                                    isBold
                                                    isRotated
                                                >
                                                    {row.COUNTRY}
                                                </StyledCell>
                                            </>
                                        )}
                                        {Object.entries(row)
                                            .filter(entry => !COLUMNS.includes(entry[0]))
                                            .map((entry, index) => {
                                                const number = Number(entry[1]);
                                                const header = headCells.find(cell => cell.id === entry[0]);
                                                const isNumber = !Number.isNaN(number);
                                                const isInsecticideClassColumn = INSECTICIDE_CLASS_COLUMNS.includes(
                                                    entry[0]
                                                );
                                                const cell = entry[0].split("_")[0];

                                                const active = row[`${cell}_N` as keyof GraphData];
                                                const active2 = row[`${entry[0]}_NUMBER_SITES` as keyof GraphData];
                                                const finalActive = active !== undefined ? active : active2;

                                                const selectedColor = isInsecticideClassColumn
                                                    ? insecticideClassColors.find(
                                                          color => color.start <= number && color.end >= number
                                                      )
                                                    : resistanceMecanishmColors.find(
                                                          color => color.start <= number && color.end >= number
                                                      );
                                                const insecticideClassBackground = selectedColor?.color;

                                                const isLastRowInCountry =
                                                    finalRows.filter(r => r.ISO2 === row.ISO2).length - 1 ===
                                                    row.COUNTRY_INDEX;

                                                return (
                                                    <StyledCell
                                                        key={`${entry[0]}_${index}`}
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        color={isNumber ? "white" : "black"}
                                                        isCenter
                                                        nowrap
                                                        removeBottomDivider={!isLastRowInCountry}
                                                    >
                                                        {header && header.numeric && isNumber && (
                                                            <div
                                                                style={{
                                                                    width: 80,
                                                                    height: 60,
                                                                    background: insecticideClassBackground,
                                                                    display: "flex",
                                                                    flexDirection: "column",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                {`${number.toFixed(1)}% ${
                                                                    finalActive !== undefined ? `(${finalActive})` : ""
                                                                }`}
                                                            </div>
                                                        )}

                                                        {(header && !header.numeric && !isNumber && entry[1]) || ""}
                                                    </StyledCell>
                                                );
                                            })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default InsecticideResistanceAndResistanceMechanismsGraph;

function EnhancedTableHead() {
    const { t } = useTranslation();

    return (
        <TableHead>
            <TableRow>
                <StyledCell isBold colSpan={2} />
                <StyledCell isBold colSpan={4} isCenter>
                    {t("common.report.prevention.insecticideClass")}
                </StyledCell>
                <StyledCell isBold colSpan={7} isCenter>
                    {t("common.report.prevention.mechanism")}
                </StyledCell>
            </TableRow>
            <TableRow style={{ height: 120 }}>
                <StyledCell colSpan={2} />
                <StyledCell isRotated>Pyrethroids</StyledCell>
                <StyledCell isRotated>Organochlorines</StyledCell>
                <StyledCell isRotated>Carbamates</StyledCell>
                <StyledCell isRotated>Organophosphates</StyledCell>
                <StyledCell isRotated>Monooxygenases</StyledCell>
                <StyledCell isRotated>Esterases</StyledCell>
                <StyledCell isRotated>GSTs</StyledCell>
                <StyledCell isRotated>kdr (K1014S)</StyledCell>
                <StyledCell isRotated>kdr (K1014F)</StyledCell>
                <StyledCell isRotated>kdr (unspecified mutation)</StyledCell>
                <StyledCell isRotated>Ace-1R</StyledCell>
            </TableRow>
        </TableHead>
    );
}

export const INSECTICIDE_CLASS_COLUMNS = [
    "PYRETHROIDS_AVERAGE_MORTALITY",
    "ORGANOCHLORINES_AVERAGE_MORTALITY",
    "CARBAMATES_AVERAGE_MORTALITY",
    "ORGANOPHOSPHATES_AVERAGE_MORTALITY",
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

export const headCells: HeadCell<GraphData>[] = [
    {
        id: "COUNTRY",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.country",
    },
    {
        id: "SPECIES",
        numeric: false,
        disablePadding: false,
        label: "common.report.prevention.species",
    },
    {
        id: "PYRETHROIDS_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
    },
    {
        id: "ORGANOCHLORINES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
    },
    {
        id: "CARBAMATES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
    },
    {
        id: "ORGANOPHOSPHATES_AVERAGE_MORTALITY",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.resistance_percentage",
    },
    {
        id: "MONOXYGENASES_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
    {
        id: "ESTERASES_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
    {
        id: "GSTS_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
    {
        id: "K1014S_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
    {
        id: "K1014F_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
    {
        id: "KDR_UNSPECIFIED_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
    {
        id: "ACE1R_PERCENT_SITES_DETECTED",
        numeric: true,
        disablePadding: false,
        label: "common.report.prevention.mechanism_percentage",
    },
];
