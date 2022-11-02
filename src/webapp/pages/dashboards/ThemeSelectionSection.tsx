import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { Button, Grid, ToggleButton, ToggleButtonGroup, Typography, Stack } from "@mui/material";
import { PreventionIcon, TreatmentIcon } from "../../components/Icons";
import MultiFilter from "../../components/filters/common/MultiFilter";
import { useTranslation } from "react-i18next";
import { Option } from "../../components/BasicSelect";
import { DashboardsThemeOptions } from "./types";
import { useDashboards } from "./context/useDashboards";
import { State } from "../../store/types";
import { selectCountries } from "../../store/reducers/country-layer-reducer";
import { fetchCountryLayerRequest } from "../../store/actions/country-layer-actions";
import { connect } from "react-redux";

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const mapStateToProps = (state: State) => ({
    countries: selectCountries(state),
});

const mapDispatchToProps = {
    fetchCountryLayer: fetchCountryLayerRequest,
};

const ThemeSelectionSection = ({ countries, fetchCountryLayer }: Props) => {
    const { t } = useTranslation();

    const { theme, selectedCountries, updatedDates, onThemeChange, onSelectedCountriesChange, onGenerate } =
        useDashboards();

    const countrySuggestions: Option[] = countries
        .filter(({ ENDEMICITY }) => ENDEMICITY === 1)
        .map(({ ISO_2_CODE }) => ({
            label: t(ISO_2_CODE),
            value: ISO_2_CODE,
        }));

    useEffect(() => {
        fetchCountryLayer();
    }, [fetchCountryLayer]);

    const handleThemeChange = useCallback(
        (_event: React.MouseEvent<HTMLElement>, value: any) => {
            onThemeChange(value);
        },
        [onThemeChange]
    );

    return (
        <FilterCard>
            <Stack spacing={3}>
                <Grid container spacing={5}>
                    <Grid item md={6} xs={12}>
                        <Stack spacing={1}>
                            <SectionTitle>{t("common.dashboard.filtersSection.first.title")}</SectionTitle>
                            <ToggleButtonGroup
                                value={theme}
                                exclusive
                                onChange={handleThemeChange}
                                aria-label="theme"
                                orientation="vertical"
                            >
                                <StyledToggleButton value="prevention" aria-label="prevention theme">
                                    <ThemeButton
                                        theme={"prevention"}
                                        selected={theme === "prevention"}
                                        label={t("common.dashboard.filtersSection.first.buttonOne")}
                                    />
                                </StyledToggleButton>
                                <StyledToggleButton value="treatment" aria-label="treatment theme">
                                    <ThemeButton
                                        theme={"treatment"}
                                        selected={theme === "treatment"}
                                        label={t("common.dashboard.filtersSection.first.buttonTwo")}
                                    />
                                </StyledToggleButton>
                            </ToggleButtonGroup>
                        </Stack>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Stack>
                            <SectionTitle>{t("common.dashboard.filtersSection.second.title")}</SectionTitle>
                            <MultiFilter
                                placeholder={t("common.filters.select_country")}
                                options={countrySuggestions}
                                onChange={onSelectedCountriesChange}
                                value={selectedCountries}
                                onlyYMargin
                            />
                            <Typography variant="caption" fontSize={"11px"}>
                                {t("common.dashboard.filtersSection.second.helper")}
                            </Typography>
                            <StyledGenerateButton
                                disabled={selectedCountries.length === 0 || theme === undefined}
                                onClick={onGenerate}
                            >
                                {t("common.dashboard.filtersSection.second.cta")}
                            </StyledGenerateButton>
                            {updatedDates[theme] && (
                                <Typography variant="caption" fontSize={"12px"} textAlign="right">
                                    {`${t("common.dashboard.filtersSection.second.lastUpdate")} ${
                                        updatedDates[theme]?.toLocaleDateString() || ""
                                    }`}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
                <Typography variant="caption" fontStyle={"italic"} color="slategray" lineHeight={1.4}>
                    {t("common.dashboard.filtersSection.note")}
                </Typography>
            </Stack>
        </FilterCard>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ThemeSelectionSection));

type ThemeButtonProps = {
    theme: DashboardsThemeOptions;
    selected: boolean;
    label: string;
};

const FilterCard = styled.div`
    background-color: white;
    padding: 40px 90px;
    border-radius: 10px;
    box-shadow: 0px 5px 10px #00000029;
    @media (max-width: 768px) {
        padding: 40px 20px;
    }
`;

const StyledToggleButton = styled(ToggleButton)`
    justify-content: flex-start;
    border-radius: 10px !important;
    &:not(:first-child) {
        margin-top: 10px !important;
        border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
    }
`;

const StyledGenerateButton = styled(Button)`
    background-color: #43cea4;
    text-transform: uppercase;
    color: white;
    width: 70%;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: small;
    @media (max-width: 768px) {
        width: 100%;
    }
    :hover {
        background-color: #91d3bf;
    }
`;

const SectionTitle = styled(Typography)`
    font-weight: bold;
    text-transform: uppercase;
    font-size: 10px;
`;

const ThemeButton = ({ theme, label, selected }: ThemeButtonProps) => {
    return (
        <Button
            sx={{ fontSize: "12px", color: "black", textTransform: "none", textAlign: "left" }}
            startIcon={
                theme === "prevention" ? <PreventionIcon selected={selected} /> : <TreatmentIcon selected={selected} />
            }
        >
            {label}
        </Button>
    );
};
