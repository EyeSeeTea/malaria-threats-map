import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, Typography, Grid } from "@mui/material";
import styled from "styled-components";
import { INSECTICIDE_CLASS_COLORS } from "./createChartData";

interface Props {
    allInsecticideClasses: string[];
    selectedInsecticideClasses: string[];
    onInsecticideClassesChange: (insecticideClasses: string[]) => void;
}

function LineChartLegend({ selectedInsecticideClasses, allInsecticideClasses, onInsecticideClassesChange }: Props) {
    const { t } = useTranslation();

    const handlerSelectedInsecticideClassesChange = React.useCallback(
        (insecticideClass: string, isChecked: boolean) => {
            const newSelection = isChecked
                ? [...selectedInsecticideClasses, insecticideClass]
                : selectedInsecticideClasses.filter(selectedClass => selectedClass !== insecticideClass);
            onInsecticideClassesChange(newSelection);
        },
        [onInsecticideClassesChange, selectedInsecticideClasses]
    );

    return (
        <InsecticideClassLegendContainer>
            <StyledTypographyTitle>
                {t(
                    "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.insecticideClassLegendTitle"
                )}
            </StyledTypographyTitle>
            <InsecticideClassOptionsGrid
                container
                rowSpacing={0}
                columnSpacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {allInsecticideClasses.map(value => (
                    <InsecticideClassItem item xs={2} sm={4} md={4} key={value}>
                        <StyledCheckbox
                            $color={INSECTICIDE_CLASS_COLORS[value] || INSECTICIDE_CLASS_COLORS.DEFAULT}
                            checked={selectedInsecticideClasses.includes(value)}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handlerSelectedInsecticideClassesChange(value, e.target.checked)
                            }
                        />
                        <StyledTypographyOption>{t(`${value}`)}</StyledTypographyOption>
                    </InsecticideClassItem>
                ))}
            </InsecticideClassOptionsGrid>
        </InsecticideClassLegendContainer>
    );
}

export default LineChartLegend;

const InsecticideClassLegendContainer = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
`;

const InsecticideClassOptionsGrid = styled(Grid)``;

const StyledCheckbox = styled(Checkbox)<{ $color: string }>`
    color: ${props => props?.$color};
    &.Mui-checked {
        color: ${props => props?.$color};
    }
`;

const InsecticideClassItem = styled(Grid)`
    display: flex;
`;

const StyledTypographyTitle = styled(Typography)`
    white-space: nowrap;
    font-weight: bold;
`;

const StyledTypographyOption = styled(Typography)`
    align-self: center;
`;
