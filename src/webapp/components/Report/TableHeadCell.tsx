import React from "react";
import { TableSortLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Data as TreatmentData } from "./treatment/columns";
import { Data as PreventionData } from "./prevention/columns";
import { HeadCell, StyledCell, useStyles } from "./types";
import { Order } from "./utils";

interface TableHeadCellProps<T = TreatmentData | PreventionData> {
    headCell: HeadCell<T>;
    order: Order;
    orderBy: string;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
    classes: ReturnType<typeof useStyles>;
    isBold?: boolean;
    rowSpan?: number;
}

export function TableHeadCell<T>({
    headCell,
    order,
    orderBy,
    onRequestSort,
    classes,
    isBold,
    rowSpan = 1,
}: TableHeadCellProps<T>) {
    const { t } = useTranslation();

    const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <StyledCell
            align={headCell.align || "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            divider={headCell.divider}
            isBold={isBold}
            rowSpan={rowSpan}
        >
            {headCell.sortable ? (
                <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={headCell.sortable ? createSortHandler(headCell.id) : () => {}}
                >
                    {t(headCell.label)}
                    {headCell.sortable && orderBy === headCell.id ? (
                        <span className={classes.visuallyHidden}>
                            {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </span>
                    ) : null}
                </TableSortLabel>
            ) : (
                t(headCell.label)
            )}
        </StyledCell>
    );
}
