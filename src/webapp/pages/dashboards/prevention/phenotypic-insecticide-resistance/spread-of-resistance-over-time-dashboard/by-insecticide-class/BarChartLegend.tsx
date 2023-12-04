import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import { ResistanceStatusColors } from "../../../../../../components/layers/prevention/ResistanceStatus/symbols";

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
        <React.Fragment>
            <LabelItemsContainer>
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
            </LabelItemsContainer>
            <LabelItemsContainer>
                <StyledTypographyTitle>
                    {t(
                        "common.dashboard.phenotypicInsecticideResistanceDashboards.spreadOfResistanceOverTime.insecticideResistanceStatus"
                    )}
                </StyledTypographyTitle>
                <StatusContainer>
                    {Object.keys(ResistanceStatusColors)
                        .filter(status => status !== "Undetermined")
                        .map(status => (
                            <StatusWrapper key={status}>
                                <CircleIcon $color={ResistanceStatusColors[status][0]} />
                                <StyledTypographyStatus>
                                    {t(
                                        `common.dashboard.phenotypicInsecticideResistanceDashboards.${status.toLowerCase()}`
                                    )}
                                </StyledTypographyStatus>
                            </StatusWrapper>
                        ))}
                </StatusContainer>
            </LabelItemsContainer>
        </React.Fragment>
    );
}

export default BarChartLegend;

const StatusWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;
`;

const StyledTypographyStatus = styled(Typography)`
    align-self: center;
    font-size: 14px;
`;

const LabelItemsContainer = styled.div`
    display: flex;
    gap: 36px;
    margin-bottom: 16px;
`;

const StyledTypographyTitle = styled(Typography)`
    white-space: nowrap;
    font-weight: bold;
`;

const StyledRadioGroup = styled(RadioGroup)`
    display: flex;
    flex-direction: row;
    gap: 24px;
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

const CircleIcon = styled.div<{ $color: string }>`
    height: 15px;
    width: 15px;
    background: ${props => props.$color};
    border: 1px solid ${props => props.$color};
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
`;
