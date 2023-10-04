import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { insecticideClassColors, resistanceMecanismColors } from "./colors";
import styled from "styled-components";

export const Legend: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Stack direction="row" justifyContent="space-around">
            <Stack direction="column" alignItems="start">
                <Typography variant="caption" fontWeight="bold">
                    Phenotypic resistance
                </Typography>
                <Typography variant="caption">% of sites exibiting resistance (No. sites monitored)</Typography>
                <Stack direction="row" justifyContent="space-between" marginTop={1}>
                    <Stack direction="column" justifyContent="space-around" marginRight={2} marginTop={3}>
                        <Typography variant="caption" gutterBottom>
                            Detected
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                            No detected
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                            No data available
                        </Typography>
                    </Stack>
                    <Stack direction="column" justifyContent="space-around">
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" gutterBottom>
                                1%
                            </Typography>
                            <Typography variant="caption" gutterBottom>
                                100%
                            </Typography>
                        </Stack>
                        <Rectangle
                            background={`linear-gradient(90deg, ${insecticideClassColors[1].color} 0%, ${insecticideClassColors[5].color} 100%)`}
                        />
                        <Rectangle background={insecticideClassColors[0].color} />
                        <Rectangle background={"white"} />
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="column" alignItems="start">
                <Typography variant="caption" fontWeight="bold">
                    Resistance mechanisms
                </Typography>
                <Typography variant="caption">
                    % of sites that detected the mechanism resistance (No. sites monitored)
                </Typography>
                <Stack direction="row" justifyContent="space-around" marginTop={4}>
                    <CircleIcon background={resistanceMecanismColors[1].color} />
                    <Typography variant="caption" gutterBottom>
                        Detected
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-around">
                    <CircleIcon background={resistanceMecanismColors[0].color} />
                    <Typography variant="caption" gutterBottom>
                        No detected
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-around">
                    <CircleIcon background={"white"} />
                    <Typography variant="caption" gutterBottom>
                        No data available
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};

const Rectangle = styled.div<{ background: string }>`
    width: 100px;
    height: 20px;
    background: ${props => props.background};
    border: 1px solid lightgray;
`;

const CircleIcon = styled.div<{ background: string }>`
    height: 15px;
    width: 15px;
    background: ${props => props.background};
    border: 1px solid lightgray;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
`;
