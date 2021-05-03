import React from "react";
import Popover from "@material-ui/core/Popover";
import Legend from "./Leyend";
import { Fab } from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";

export default function LegendPopover() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <div>
            <Fab size={"small"} onClick={handlePopoverOpen}>
                <ListIcon />
            </Fab>
            <Popover
                id="mouse-over-popover"
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Legend />
            </Popover>
        </div>
    );
}
