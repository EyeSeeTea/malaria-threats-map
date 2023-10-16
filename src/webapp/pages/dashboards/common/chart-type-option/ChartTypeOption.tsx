import { ToggleButton } from "@mui/material";
import styled from "styled-components";

export const ChartTypeOption = styled(ToggleButton)`
    border-radius: 5px !important;
    margin-right: 16px;
    padding: 16px 32px;
    color: black;
    background-color: white;
    border: 0px;
    &.Mui-selected {
        color: white;
        background-color: #2fb3af;
    }
    min-width: 180px;
`;
