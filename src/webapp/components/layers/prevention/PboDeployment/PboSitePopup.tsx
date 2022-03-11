import * as React from "react";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import PreventionPopupContent from "../PreventionPopupContent";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const PboSitePopup = ({ studies }: Props) => {
    const studyObject = studies[0];
    return <PreventionPopupContent studyObject={studyObject} />;
};

export default connect(mapStateToProps)(PboSitePopup);
