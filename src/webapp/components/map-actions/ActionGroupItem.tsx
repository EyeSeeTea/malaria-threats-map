import React, { ReactNode } from "react";

import { ActionGroup, State } from "../../store/types";
import { selectActionGroupSelected } from "../../store/reducers/base-reducer";
import { setActionGroupSelected } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import ExpandableContainer from "../DataDownload/ExpandableContainer";

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
    childrenMaxHeight?: string;
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
    childrenMaxHeight,
}) => {
    const expanded = React.useMemo(() => actionGroupSelected === actionGroupKey, [actionGroupSelected, actionGroupKey]);

    const handleExpand = (value: boolean) => {
        setActionGroupSelected(value ? actionGroupKey : null);
    };

    return (
        <ExpandableContainer
            onExpand={handleExpand}
            expanded={expanded}
            placeholder={placeholder}
            value={value}
            childrenMaxHeight={childrenMaxHeight}
        >
            {children}
        </ExpandableContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionGroupItem);
