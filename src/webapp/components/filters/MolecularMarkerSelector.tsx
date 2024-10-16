import React from "react";
import { useTranslation } from "react-i18next";
import { ValueType } from "react-select";
import IntegrationReactSelect, { OptionType } from "../BasicSelect";
import styled from "styled-components";
import { Divider, FilterWrapper } from "./Filters";
import { Typography } from "@mui/material";
import { MolecularMarker, MOLECULAR_MARKERS, molecularMarkerTranslations } from "./MolecularMarkerRadioFilter";

type DrugsSelectorProps = {
    onChange: (selection: MolecularMarker) => void;
    value: number;
    multi?: boolean;
    background?: string;
    onlyYMargin?: boolean;
    labelBold?: boolean;
    isClearable?: boolean;
};

const MolecularMarkerSelector: React.FC<DrugsSelectorProps> = ({
    onChange,
    value,
    multi = true,
    background,
    onlyYMargin = false,
    labelBold = false,
    isClearable = false,
}) => {
    const { t } = useTranslation();

    const options = MOLECULAR_MARKERS.map(marker => ({
        value: marker.value,
        label: t(molecularMarkerTranslations[marker.label]) || t(marker.label),
    }));

    const onSelectionChange = (selected: ValueType<OptionType, false>) => {
        onChange(selected?.value);
    };

    const translatedMolecularMarkers = MOLECULAR_MARKERS.map(marker => ({
        ...marker,
        label: t(molecularMarkerTranslations[marker.label]) || marker.label,
    }));
    const selection = translatedMolecularMarkers.find(marker => marker.value === value);
    console.log({ selection, MOLECULAR_MARKERS, value, options });

    return (
        <FilterWrapper onlyYMargin={onlyYMargin}>
            <Typography variant="body2" fontWeight={labelBold ? "bold" : undefined}>
                {t("common.filters.molecular_marker")}
            </Typography>
            <Divider />
            <Container background={background}>
                <IntegrationReactSelect
                    suggestions={options}
                    onChange={onSelectionChange}
                    value={selection}
                    isMulti={multi}
                    isClearable={isClearable}
                />
            </Container>
        </FilterWrapper>
    );
};

export default MolecularMarkerSelector;

const Container = styled.div<{ background: string }>`
    background: ${props => props.background || "transparent"};
    padding: ${props => (props.background ? "6px 16px;" : "0px;")};
    border-radius: ${props => (props.background ? "10px;" : "0px;")};
`;
