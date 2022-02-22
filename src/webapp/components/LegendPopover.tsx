import React from "react";
import Popover from "@mui/material/Popover";
import Legend from "./Leyend";
import { Fab } from "@mui/material";
import ListIcon from "@mui/icons-material/List";

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
