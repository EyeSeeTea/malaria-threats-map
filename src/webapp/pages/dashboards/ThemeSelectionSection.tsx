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
import { connect } from "react-redux";
import { selectTranslations } from "../../store/reducers/translations-reducer";
import { useAppContext } from "../../context/app-context";
import { Country } from "../../../domain/entities/Country";

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps;

const mapStateToProps = (state: State) => ({
    translations: selectTranslations(state),
});

const ThemeSelectionSection = ({ translations }: Props) => {
    const [countries, setCountries] = React.useState<Country[]>([]);
    const [countryOptions, setCountryOptions] = React.useState<Option[]>([]);

    const { t } = useTranslation();
    const { compositionRoot } = useAppContext();

    const { theme, selectedCountries, updatedDates, onThemeChange, onSelectedCountriesChange, onGenerate } =
        useDashboards();

    useEffect(() => {
        compositionRoot.countries.get().run(
            countries => {
                setCountries(countries);
            },
            () => {
                setCountries([]);
            }
        );
    }, [compositionRoot]);

    useEffect(() => {
        if (translations.length === 0) return;

        const options = countries
            .filter(({ endemicity }) => endemicity === true)
            .map(({ iso2Code }) => ({
                label: t(iso2Code),
                value: iso2Code,
            }));

        setCountryOptions(options);
    }, [translations, countries, t]);

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
                                options={countryOptions}
                                onChange={onSelectedCountriesChange}
                                value={selectedCountries}
                                margin="10px 0px"
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

export default connect(mapStateToProps)(React.memo(ThemeSelectionSection));

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
