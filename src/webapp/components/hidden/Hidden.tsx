import { Theme, useMediaQuery } from "@mui/material";
import React from "react";

interface HiddenProps {
    smDown?: boolean;
    smUp?: boolean;
}

const Hidden: React.FC<HiddenProps> = ({ children, smUp, smDown }) => {
    const isSmUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
    const isSmDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const hidden = (smUp && isSmUp) || (smDown && isSmDown);

    return hidden ? null : <React.Fragment>{children}</React.Fragment>;
};

export default Hidden;
