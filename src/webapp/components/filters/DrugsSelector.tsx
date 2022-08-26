import React from "react";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { ValueType } from "react-select";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import styled from "styled-components";
import { Divider, FilterWrapper } from "./Filters";
import { Typography } from "@mui/material";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";

type DrugsSelectorProps = {
    studies: TreatmentStudy[];
    onChange: (selection: string[]) => void;
    value: string[];
    multi?: boolean;
    background?: string;
    onlyYMargin?: boolean;
    labelBold?: boolean;
    isClearable?: boolean;
};

const DrugsSelector: React.FC<DrugsSelectorProps> = ({
    studies,
    onChange,
    value,
    multi = true,
    background,
    onlyYMargin = false,
    labelBold = false,
    isClearable = false,
}) => {
    const { t } = useTranslation();
    const uniques = R.uniq(R.map(R.prop("DRUG_NAME"), studies)).filter(Boolean);

    const suggestions = uniques.map((drug: string) => ({
        label: t(drug),
        value: drug,
    }));

    const sortedSuggestions = R.sortBy(R.prop("label"), suggestions);

    const onSelectionChange = (selected: ValueType<OptionType, false>) => {
        if (Array.isArray(selected)) {
            onChange(selected.map(v => v.value));
        } else {
            onChange(selected.value);
        }
    };

    const selection = sortedSuggestions.filter(suggestion => value.includes(suggestion.value));

    return (
        <FilterWrapper onlyYMargin={onlyYMargin}>
            <Typography variant="body2" fontWeight={labelBold ? "bold" : undefined}>
                {t("common.filters.drug")}
            </Typography>
            <Divider />
            <Container background={background}>
                <IntegrationReactSelect
                    suggestions={sortedSuggestions}
                    onChange={onSelectionChange}
                    value={selection}
                    isMulti={multi}
                    isClearable={isClearable}
                />
            </Container>
        </FilterWrapper>
    );
};

export default DrugsSelector;

const Container = styled.div<{ background: string }>`
    background: ${props => props.background || "transparent"};
    padding: ${props => (props.background ? "6px 16px;" : "0px;")};
    border-radius: ${props => (props.background ? "10px;" : "0px;")};
`;
