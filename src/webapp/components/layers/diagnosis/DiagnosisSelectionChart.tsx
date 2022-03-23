import React, { Component } from "react";
import { DiagnosisMapType, State } from "../../../store/types";
import {
    selectCountryMode,
    selectViewData,
    selectTheme,
    selectRegion,
    selectFilters,
    selectSelection,
} from "../../../store/reducers/base-reducer";
import { setPreventionFilteredStudiesAction } from "../../../store/actions/prevention-actions";
import { connect } from "react-redux";
import GeneDeletionChart from "./GeneDeletions/GeneDeletionChart";
import GeneDeletionCountryChart from "./GeneDeletions/GeneDeletionCountryChart";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { DiagnosisStudy } from "../../../../domain/entities/DiagnosisStudy";
import styled from "styled-components";
import { buildDiagnosisFilters } from "../studies-filters";

const InfoContainer = styled.div`
    padding: 0px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    countryMode: selectCountryMode(state),
    viewData: selectViewData(state),
    region: selectRegion(state),
    filters: selectFilters(state),
    selection: selectSelection(state),
});

const mapDispatchToProps = {
    setFilteredStudies: setPreventionFilteredStudiesAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    studies: DiagnosisStudy[];
    popup: boolean;
};
type Props = StateProps & DispatchProps & OwnProps;

class DiagnosisSelectionChart extends Component<Props> {
    render() {
        const {
            theme,
            studies,
            countryMode,
            viewData,
            popup,
            selection,
            diagnosisFilters: { mapType },
            filters,
            region,
        } = this.props;
        console.log("hello in DiagnosisSelectionChart");
        const filterFf = buildDiagnosisFilters(this.props.diagnosisFilters, filters, region);
        const ff = filterFf.reduce((studies, filter) => studies.filter(filter), studies);
        console.log(ff);
        /*if (!viewData) {
            return <div />;
        }*/
        /*const filteredStudies = ff.filter(study =>
            countryMode ? study.ISO2 === selection.ISO_2_CODE : study.SITE_ID === selection.SITE_ID
        );
        if (theme !== "diagnosis") {
            return <div />;
        }
        console.log(filteredStudies)*/

        return (
            <>
                {!countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
                    <GeneDeletionChart studies={studies} popup={popup} />
                )}
                {countryMode && mapType === DiagnosisMapType.GENE_DELETIONS && (
                    <GeneDeletionCountryChart studies={studies} />
                )}
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSelectionChart);
