import { State } from "../store/types";
import { selectLegendExpanded } from "../store/reducers/base-reducer";
import { setLegendExpandedAction } from "../store/actions/base-actions";
import React from "react";
import { ClickAwayListener, IconButton } from "@material-ui/core";
import GrowIcon from "@material-ui/icons/Info";
import ReduceIcon from "@material-ui/icons/ExpandMore";
import { connect } from "react-redux";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";

const LegendContainerStyled = styled(Paper)<{ size?: number }>`
  padding: 8px;
  display: flex;
  flex-direction: column;
  max-width: ${(props) => props.size | 200}px;
  width: 100%;
  font-size: 12px;
  box-shadow: none !important;
`;

const LegendContent = styled.div<{ small: boolean }>`
  margin-right: ${(props) => (props.small ? "20px" : 0)};
`;

const IconContainer = styled.div`
  position: absolute;
  flex-direction: reverse;
  right: 4px;
  top: 4px;
`;

const mapStateToProps = (state: State) => ({
  legendExpanded: selectLegendExpanded(state),
});

const mapDispatchToProps = {
  setLegendExpanded: setLegendExpandedAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  children: React.ReactNode;
};
type Props = DispatchProps & StateProps & OwnProps;

const LegendContainer = ({
  children,
  legendExpanded,
  setLegendExpanded,
}: Props) => {
  const small = !legendExpanded;
  return (
    <LegendContainerStyled size={small ? 200 : 600} role="group" aria-label="Legend">
      <IconContainer>
        <IconButton
          size={"small"}
          aria-label="upload picture"
          component="span"
          onClick={() => setLegendExpanded(!legendExpanded)}
        >
          {small ? (
            <GrowIcon fontSize={"small"} />
          ) : (
            <ReduceIcon fontSize={"small"} />
          )}
        </IconButton>
      </IconContainer>
      <ClickAwayListener onClickAway={() => setLegendExpanded(false)}>
        <LegendContent small>{children}</LegendContent>
      </ClickAwayListener>
    </LegendContainerStyled>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LegendContainer);
