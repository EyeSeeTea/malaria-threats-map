import { ToggleButton } from "@mui/material";
import styled from "styled-components";

export const ChartTypeOption = styled(ToggleButton)`
    border-radius: 5px !important;
    padding: 16px 32px;
    color: black;
    background-color: white;
    border: 0px;
    &.Mui-selected {
        color: white;
        background-color: #2fb3af;
    }
    min-width: fit-content;
    max-width: 180px;
    width: 100%;
`;
