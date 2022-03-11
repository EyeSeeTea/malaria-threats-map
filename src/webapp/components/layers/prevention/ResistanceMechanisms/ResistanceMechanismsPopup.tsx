import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";
import PreventionPopupContent from "../PreventionPopupContent";

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const ResistanceMechanismsPopup = ({ studies }: Props) => {
    const studyObject = studies[0];
    return (
        <>
            <Hidden smUp>
                <ChatContainer width={"100%"}>
                    <PreventionPopupContent studyObject={studyObject} />
                </ChatContainer>
            </Hidden>
            <Hidden smDown>
                <ChatContainer width={"500px"}>
                    <PreventionPopupContent studyObject={studyObject} />
                </ChatContainer>
            </Hidden>
        </>
    );
};
export default connect(mapStateToProps)(ResistanceMechanismsPopup);
