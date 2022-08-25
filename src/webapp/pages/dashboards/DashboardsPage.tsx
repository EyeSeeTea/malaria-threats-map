import React from "react";
import styled from "styled-components";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ThemeSelectionSection from "./ThemeSelectionSection";
import ContentsFilterSection from "./ContentsFilterSection";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import { selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { State } from "../../store/types";
import { fetchTreatmentStudiesRequest } from "../../store/actions/treatment-actions";
import { connect } from "react-redux";
import { useDashboards } from "./useDashboards";

const StyledContainer = styled.div`
    background-color: #43cea4;
    display: flex;
    width: 100%;
    height: 400px;
`;

const mapStateToProps = (state: State) => ({
    treatmentStudies: selectTreatmentStudies(state),
});

const mapDispatchToProps = {
    fetchTreatmentStudies: fetchTreatmentStudiesRequest,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const DashboardsPage: React.FC<Props> = ({ treatmentStudies, fetchTreatmentStudies }) => {
    const { t } = useTranslation();
    const {
        state,
        onThemeChange,
        onSelectedCountriesChange,
        onCountryContextChange,
        onTherapeuticResultsChange,
        onMolecularResultsChange,
    } = useDashboards(treatmentStudies, fetchTreatmentStudies);

    return (
        <SecondaryLayout>
            <StyledContainer>
                <Container maxWidth="md">
                    <Typography mt={"90px"} fontSize={"40px"} fontWeight="bold">
                        {t("common.dashboard.title")}
                    </Typography>
                </Container>
            </StyledContainer>
            <Container maxWidth="md" sx={{ marginTop: "-200px" }}>
                <ThemeSelectionSection
                    theme={state.theme}
                    countries={state.selectedCountries}
                    onCountriesChange={onSelectedCountriesChange}
                    onThemeChange={onThemeChange}
                />
            </Container>
            <Container maxWidth="lg">
                <ContentsFilterSection
                    selectedCountryContext={state.countryContext}
                    selectedTherapeutic={state.therapeuticResults}
                    selectedMolecular={state.molecularResults}
                    onCountryContextChange={onCountryContextChange}
                    onTherapeuticChange={onTherapeuticResultsChange}
                    onMolecularChange={onMolecularResultsChange}
                />
            </Container>
        </SecondaryLayout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsPage);
