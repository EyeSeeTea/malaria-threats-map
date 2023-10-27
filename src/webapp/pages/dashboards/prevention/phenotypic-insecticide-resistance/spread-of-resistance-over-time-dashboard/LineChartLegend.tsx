import React from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, Typography, Grid } from "@mui/material";
import styled from "styled-components";

import { INSECTICIDE_CLASS_COLORS, INSECTICIDE_TYPE_COLORS } from "./createLineChartData";
import { SpreadOfResistanceOverTimeChartType } from "../types";

interface Props {
    chartType: SpreadOfResistanceOverTimeChartType;
    allInsecticideClassesOrTypes: string[];
    selectedInsecticideClassesOrTypes: string[];
    onInsecticideClassesOrTypesChange: (insecticideClassesOrTypes: string[]) => void;
}

function LineChartLegend({
    selectedInsecticideClassesOrTypes,
    allInsecticideClassesOrTypes,
    onInsecticideClassesOrTypesChange,
    chartType,
}: Props) {
    const { t } = useTranslation();

    const handlerSelectedInsecticideClassesChange = React.useCallback(
        (insecticideClassOrType: string, isChecked: boolean) => {
            const newSelection = isChecked
                ? [...selectedInsecticideClassesOrTypes, insecticideClassOrType]
                : selectedInsecticideClassesOrTypes.filter(
                      selectedClassOrType => selectedClassOrType !== insecticideClassOrType
                  );
            onInsecticideClassesOrTypesChange(newSelection);
        },
        [onInsecticideClassesOrTypesChange, selectedInsecticideClassesOrTypes]
    );

    return (
        <InsecticideClassLegendContainer>
            <StyledTypographyTitle>
                {chartType === "by-insecticide-class"
                    ? t(
                          "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.insecticideClassLegendTitle"
                      )
                    : t(
                          "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.insecticideTypeLegendTitle"
                      )}
            </StyledTypographyTitle>
            <InsecticideClassOptionsGrid
                container
                rowSpacing={0}
                columnSpacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {allInsecticideClassesOrTypes.map(value => (
                    <InsecticideClassItem item xs={2} sm={4} md={4} key={value}>
                        <StyledCheckbox
                            $color={
                                chartType === "by-insecticide-class"
                                    ? INSECTICIDE_CLASS_COLORS[value]
                                    : INSECTICIDE_TYPE_COLORS[value]
                            }
                            checked={selectedInsecticideClassesOrTypes.includes(value)}
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
    gap: 36px;
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
    font-size: 14px;
`;
