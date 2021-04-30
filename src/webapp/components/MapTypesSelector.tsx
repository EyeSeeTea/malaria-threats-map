import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../store/types";
import { selectTheme } from "../store/reducers/base-reducer";
import styled from "styled-components";
import PreventionMapTypesSelector from "./filters/PreventionMapTypesSelector";
import InvasiveMapTypesSelector from "./filters/InvasiveMapTypesSelector";
import TreatmentMapTypesSelector from "./filters/TreatmentMapTypesSelector";
import DiagnosisMapTypesSelector from "./filters/DiagnosisMapTypesSelector";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const Wrapper = styled.div`
    min-width: 250px;
`;

export class MapTypesSelector extends Component<StateProps> {
    render() {
        const { theme } = this.props;
        return (
            <Wrapper>
                {theme === "prevention" && <PreventionMapTypesSelector />}
                {theme === "diagnosis" && <DiagnosisMapTypesSelector />}
                {theme === "treatment" && <TreatmentMapTypesSelector />}
                {theme === "invasive" && <InvasiveMapTypesSelector />}
            </Wrapper>
        );
    }
}

export default connect(mapStateToProps)(MapTypesSelector);
