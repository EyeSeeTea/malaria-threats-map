import React, { Component } from "react";
import {
  DiagnosisIcon,
  InvasiveIcon,
  PreventionIcon,
  TreatmentIcon
} from "./Icons";
import styled from "styled-components";
import { Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { State } from "../store/types";
import { connect } from "react-redux";
import { setThemeAction } from "../store/actions/base-actions";
import { selectTheme } from "../store/reducers/base-reducer";

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 90%;
`;

const StyledPaper = styled(Paper)`
  min-width: 275px;
  padding: 8px;
`;

const ThemeButton = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const StyledIconButton = styled(IconButton)`
  padding: 8px !important;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});

const mapDispatchToProps = {
  setTheme: setThemeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

class TopicSelector extends Component<Props> {
  render() {
    const { theme, setTheme } = this.props;
    return (
      <StyledPaper>
        <ButtonGroup>
          <ThemeButton>
            <StyledIconButton onClick={() => setTheme("prevention")}>
              <PreventionIcon active={theme === "prevention"} />
            </StyledIconButton>
            Prevention
          </ThemeButton>
          <ThemeButton>
            <StyledIconButton onClick={() => setTheme("diagnosis")}>
              <DiagnosisIcon active={theme === "diagnosis"} />
            </StyledIconButton>
            Diagnosis
          </ThemeButton>
          <ThemeButton>
            <StyledIconButton onClick={() => setTheme("treatment")}>
              <TreatmentIcon active={theme === "treatment"} />
            </StyledIconButton>
            Treatment
          </ThemeButton>
          <ThemeButton>
            <StyledIconButton onClick={() => setTheme("invasive")}>
              <InvasiveIcon active={theme === "invasive"} />
            </StyledIconButton>
            Invasive
          </ThemeButton>
        </ButtonGroup>
      </StyledPaper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSelector);
