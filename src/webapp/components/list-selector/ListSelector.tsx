import React from "react";

import { List, ListItemButton, ListItemText } from "@mui/material";
import { connect } from "react-redux";
import styled from "styled-components";

const StyledList = styled(List)`
    padding: 0px;
`;

const SelectableListItem = styled(ListItemButton)`
    background-color: #f5f5f5;
    border-radius: 5px;
    margin: 10px 20px;
    span {
        font-size: 12px;
        font-weight: bold;
    }
    p {
        font-size: 12px;
    }
    &.Mui-selected {
        background-color: #e2e2e2;
    }
    &.Mui-selected:hover {
        background-color: #e2e2e2;
    }
`;

export interface ListSelectorItem {
    title: string;
    subtitle?: string;
    value: number | string;
}

interface ListSelectorProps {
    items: ListSelectorItem[];
    value: ListSelectorItem;
    onChange: (selection: ListSelectorItem) => void;
    onMouseOver?: (selection: ListSelectorItem) => void;
}

const ListSelector: React.FC<ListSelectorProps> = ({ items, value, onChange, onMouseOver }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => setSelectedIndex(items.indexOf(value)), [value, items]);

    const handleListItemClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setSelectedIndex(index);
        onChange(items[index]);
    };

    const handleListItemMouseOver = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
        setSelectedIndex(index);

        if (onMouseOver) {
            onMouseOver(items[index]);
        }
    };

    return (
        <StyledList>
            {items.map((item, index) => {
                return (
                    <SelectableListItem
                        key={item.title}
                        selected={selectedIndex === index}
                        onClick={event => handleListItemClick(event, index)}
                        onMouseOver={event => handleListItemMouseOver(event, index)}
                    >
                        <ListItemText primary={item.title} secondary={item.subtitle} />
                    </SelectableListItem>
                );
            })}
        </StyledList>
    );
};

export default connect()(ListSelector);
