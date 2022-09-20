import React from "react";
import { Fab, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import styled from "styled-components";

interface DashboardTitleProps {
    title: string;
    showActions: boolean;
    onDownloadClick: () => void;
}

const DashboardTitle: React.FC<DashboardTitleProps> = ({ title, showActions, onDownloadClick }) => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Title>{title}</Title>
            {showActions && (
                <Stack direction="row" spacing={2}>
                    <Fab color="primary" size="small">
                        <InfoOutlinedIcon sx={{ color: "white", width: "20px" }} />
                    </Fab>
                    <Fab color="primary" size="small" onClick={onDownloadClick}>
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
`;
