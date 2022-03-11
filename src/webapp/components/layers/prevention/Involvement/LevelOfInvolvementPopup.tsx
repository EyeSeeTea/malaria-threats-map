import * as React from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import PreventionPopupContent from "../PreventionPopupContent";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const LevelOfInvolvementPopup = ({ studies: baseStudies }: Props) => {
    const [study, setStudy] = useState(0);
    const groupedStudies = R.values(R.groupBy(R.prop("CITATION_URL"), baseStudies));
    const studies = groupedStudies[study];

    const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);

    const studyObject = sortedStudies[study];

    return <PreventionPopupContent studyObject={studyObject} />;
};
export default connect(mapStateToProps)(LevelOfInvolvementPopup);
