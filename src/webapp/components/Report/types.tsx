import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { Order } from "./utils";

export type CellProps = {
    isBold?: boolean;
    color?: string;
    isRight?: boolean;
    divider?: boolean;
};

export const StyledCell = styled(TableCell)<CellProps>`
    font-size: ${props => (props.isBold ? "12px" : "11.5px")} !important;
    line-height: 1rem !important;
    padding: 3px 6px !important;
    font-weight: ${props => (props.isBold ? "bold" : "normal")} !important;
    color: ${props => props.color || "inherit"} !important;
    ${props => props.isRight && "text-align: right !important"};
    ${props => props.divider && "border-left: 1px solid rgba(224, 224, 224, 1)"}
`;

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        paper: {
            width: "100%",
        },
        wrapper: {
            padding: theme.spacing(0, 2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            top: 20,
            width: 1,
        },
        cell: {
            fontSize: 10,
        },
    })
);

export interface EnhancedTableProps<T> {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export interface HeadCell<T> {
    id: keyof T;
    numeric: boolean;
    disablePadding: boolean;
    label: string;
    sortable?: boolean;
    align?: "right" | "left" | "center";
    divider?: boolean;
    decimalPositions?: number;
}
