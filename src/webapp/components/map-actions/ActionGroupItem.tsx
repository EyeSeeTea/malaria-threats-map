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
    padding: 15px 20px;
    text-transform: none;
`;

const Placeholder = styled.span`
    text-align: start;
    flex-grow: 1;
    font-weight_bold
`;

const Value = styled.span`
    text-align: start;
    flex-grow: 1;
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
    placeholder: string;
    value?: ReactNode;
    actionGroupKey: ActionGroup;
    children?: ReactNode | undefined;
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type ActionGroupProps = DispatchProps & StateProps & OwnProps;

const ActionGroupItem: React.FC<ActionGroupProps> = ({
    placeholder,
    value,
    actionGroupKey,
    children,
    actionGroupSelected,
    setActionGroupSelected,
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpand = () => {
        if (children) {
            setExpanded(!expanded);
            setActionGroupSelected(actionGroupKey);
        }
    };

    React.useEffect(() => setExpanded(actionGroupSelected === actionGroupKey), [actionGroupSelected, actionGroupKey]);

    return (
        <React.Fragment>
            <TitleContainer onClick={handleExpand} disableGutters>
                <StyledButton fullWidth={true}>
                    {value && !expanded ? <Value>{value}</Value> : <Placeholder>{placeholder}</Placeholder>}
                    {children ? expanded ? <ExpandLess /> : <ExpandMore /> : null}
                </StyledButton>
            </TitleContainer>
            {children && (
                <Collapse in={expanded} timeout="auto" unmountOnExit key={actionGroupKey}>
                    {children}
                </Collapse>
            )}
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionGroupItem);
