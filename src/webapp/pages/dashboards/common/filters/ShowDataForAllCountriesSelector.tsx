import React from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ShowDataForCountries } from "../../treatment/filters/TreatmentFiltersState";

type ShowDataForAllCountriesSelectorProps = {
    value: ShowDataForCountries;
    onChange: (value: ShowDataForCountries) => void;
};

const ShowDataForAllCountriesSelector: React.FC<ShowDataForAllCountriesSelectorProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange((event.target as HTMLInputElement).value as ShowDataForCountries);
    };

    console.log({ value });

    return (
        <Container>
            <RadioGroup aria-label="all Countries" value={String(value)} onChange={handleChange}>
                <FormControlLabel value={"selected"} control={<Radio />} label="Show selected countries/areas" />
                <FormControlLabel value={"all"} control={<Radio />} label="Show all countries/areas" />
            </RadioGroup>
        </Container>
    );
};
export default ShowDataForAllCountriesSelector;

export const Container = styled.div`
    margin: 10px 0px;
`;
