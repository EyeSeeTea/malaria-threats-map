import React from "react";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import { Divider, FilterWrapper } from "./Filters";
import { ValueType } from "react-select/src/types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";

type OwnProps = {
    onChange: (selection: string) => void;
    value: string;
    multi?: boolean;
    background?: string;
    onlyYMargin?: boolean;
    labelBold?: boolean;
    isDisabled?: boolean;
};

type Props = OwnProps;

const PLASMODIUM_SPECIES_SUGGESTIONS: any[] = [
    {
        label: "P. falciparum",
        value: "P._FALCIPARUM",
    },
    {
        label: "P. vivax",
        value: "P._VIVAX",
    },
    {
        label: "P. knowlesi",
        value: "P._KNOWLESI",
    },
    {
        label: "P. malariae",
        value: "P._MALARIAE",
    },
    {
        label: "P. ovale",
        value: "P._OVALE",
    },
];

function PlasmodiumSpecieSelector({
    onChange,
    value,
    multi = true,
    background,
    onlyYMargin = false,
    labelBold = false,
    isDisabled = false,
}: Props) {
    const onSelectionChange = (value: ValueType<OptionType, false>) => {
        const selection = value as OptionType;
        onChange(selection.value);
    };

    const { t } = useTranslation();

    const selection = PLASMODIUM_SPECIES_SUGGESTIONS.filter(suggestion => value === suggestion.value);
    return (
        <FilterWrapper onlyYMargin={onlyYMargin}>
            <Typography variant="body2" fontWeight={labelBold ? "bold" : undefined}>
                {t("common.filters.plasmodium_species")}
            </Typography>
            <Divider />
            <Container background={background}>
                <IntegrationReactSelect
                    suggestions={PLASMODIUM_SPECIES_SUGGESTIONS}
                    onChange={onSelectionChange}
                    value={selection}
                    multi={multi}
                    isDisabled={isDisabled}
                />
            </Container>
        </FilterWrapper>
    );
}

export default PlasmodiumSpecieSelector;

const Container = styled.div<{ background: string }>`
    background: ${props => props.background || "transparent"};
    padding: ${props => (props.background ? "6px 16px;" : "0px;")};
    border-radius: ${props => (props.background ? "10px;" : "0px;")};
`;
