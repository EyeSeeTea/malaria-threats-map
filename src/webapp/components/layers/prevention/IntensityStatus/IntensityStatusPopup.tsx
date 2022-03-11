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

const IntensityStatusPopup = ({ studies: baseStudies }: Props) => {
    const [study, setStudy] = useState(0);
    const groupedStudies = R.values(R.groupBy(R.prop("CITATION_URL"), baseStudies));
    const studies = groupedStudies[study];
    const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);

    const cleanedStudies = R.groupBy((study: PreventionStudy) => {
        return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_INTENSITY}`;
    }, sortedStudies);

    const simplifiedStudies = R.values(cleanedStudies)
        .map(
            (groupStudies: PreventionStudy[]) => R.sortBy(study => -parseInt(study.MORTALITY_ADJUSTED), groupStudies)[0]
        )
        .sort(
            (a, b) =>
                Number(a.YEAR_START) - Number(b.YEAR_START) ||
                a.INSECTICIDE_TYPE.localeCompare(b.INSECTICIDE_TYPE) ||
                Number(a.INSECTICIDE_INTENSITY) - Number(b.INSECTICIDE_INTENSITY)
        );

    const studyObject = simplifiedStudies[0];

    return <PreventionPopupContent studyObject={studyObject} />;
};
export default connect(mapStateToProps)(IntensityStatusPopup);
