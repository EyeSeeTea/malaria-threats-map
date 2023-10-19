import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import styled from "styled-components";

interface Props {
    allInsecticideClasses: string[];
    selectedInsecticideClass: string;
    onInsecticideClassChange: (insecticideClass: string) => void;
}

function BarChartLegend({ allInsecticideClasses, selectedInsecticideClass, onInsecticideClassChange }: Props) {
    const { t } = useTranslation();

    const handlerSelectedInsecticideClassChange = React.useCallback(
        (event: React.ChangeEvent<unknown>) => {
            const newSelection = (event.target as HTMLInputElement).value;
            onInsecticideClassChange(newSelection);
        },
        [onInsecticideClassChange]
    );

    if (!selectedInsecticideClass) return null;

    return (
        <InsecticideClassLegendContainer>
            <StyledTypographyTitle>
                {t(
                    "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.insecticideClassLegendTitle"
                )}
            </StyledTypographyTitle>
            <StyledRadioGroup
                value={selectedInsecticideClass}
                onChange={handlerSelectedInsecticideClassChange}
                sx={{ paddingLeft: 2 }}
            >
                {allInsecticideClasses.map(value => (
                    <StyledFormControlLabel
                        key={value}
                        value={value}
                        control={<Radio />}
                        label={t(`${value}`) as string}
                    />
                ))}
            </StyledRadioGroup>
        </InsecticideClassLegendContainer>
    );
}

export default BarChartLegend;

const InsecticideClassLegendContainer = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
`;

const StyledTypographyTitle = styled(Typography)`
    white-space: nowrap;
    font-weight: bold;
`;

const StyledRadioGroup = styled(RadioGroup)`
    display: flex;
    flex-direction: row;
    gap: 16px;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
        font-size: 14px;
    }
    & svg {
        left: 2px;
    }
`;
