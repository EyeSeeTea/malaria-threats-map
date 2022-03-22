import React, { ReactNode } from "react";

import { Button, Collapse, ListItem } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ActionGroup, State } from "../../store/types";
import { selectActionGroupSelected } from "../../store/reducers/base-reducer";
import { setActionGroupSelected } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import styled from "styled-components";

const StyledButton = styled(Button)`
    color: black;
    padding: 16px;
`;

const Title = styled.span`
    text-align: start;
    flex-grow: 1;
    font-weight: bold;
`;

const TitleContainer = styled(ListItem)`
    padding: 0px;
`;

const mapStateToProps = (state: State) => ({
    actionGroupSelected: selectActionGroupSelected(state),
});

const mapDispatchToProps = {
    setActionGroupSelected: setActionGroupSelected,
};

type OwnProps = {
    title: string;
    actionGroupKey: ActionGroup;
    children?: ReactNode | undefined;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type ActionGroupProps = DispatchProps & StateProps & OwnProps;

const ActionGroupItem: React.FC<ActionGroupProps> = ({
    title,
    actionGroupKey,
    children,
    actionGroupSelected,
    setActionGroupSelected,
}) => {
    const [openCollapse, setOpenCollapse] = React.useState(false);

    const handleExpand = () => {
        setOpenCollapse(!openCollapse);
        setActionGroupSelected(actionGroupKey);
    };

    React.useEffect(
        () => setOpenCollapse(actionGroupSelected === actionGroupKey),
        [actionGroupSelected, actionGroupKey]
    );

    return (
        <React.Fragment>
            <TitleContainer onClick={handleExpand} disableGutters>
                <StyledButton fullWidth={true}>
                    <Title>{title}</Title>
                    {openCollapse ? <ExpandLess /> : <ExpandMore />}
                </StyledButton>
            </TitleContainer>
            <Collapse in={openCollapse} timeout="auto" unmountOnExit key={actionGroupKey}>
                {children}
            </Collapse>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionGroupItem);
