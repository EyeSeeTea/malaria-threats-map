import React from "react";
import { Fab, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import styled from "styled-components";

interface DashboardTitleProps {
    id?: string;
    title: string;
    showActions: boolean;
    onInfoClick: () => void;
    onDownloadClick: () => void;
}

const DashboardTitle: React.FC<DashboardTitleProps> = ({ id, title, showActions, onInfoClick, onDownloadClick }) => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Title id={id}>{title}</Title>
            {showActions && (
                <Stack direction="row" spacing={2}>
                    <Fab color="primary" size="small" onClick={onInfoClick} className={"dashboard-action"}>
                        <InfoOutlinedIcon sx={{ color: "white", width: "20px" }} />
                    </Fab>
                    <Fab color="primary" size="small" onClick={onDownloadClick} className={"dashboard-action"}>
                        <DownloadIcon sx={{ color: "white" }} />
                    </Fab>
                </Stack>
            )}
        </Stack>
    );
};

export default DashboardTitle;

const Title = styled.h3`
    font-size: 23px;
    margin-bottom: 30px;
    color: #2ba681;
    text-transform: uppercase;
    width: 100%;
`;
