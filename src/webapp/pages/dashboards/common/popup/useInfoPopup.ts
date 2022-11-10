import React from "react";

export function useInfoPopup() {
    const [openPopup, setOpenPoup] = React.useState(false);

    const onChangeOpenPopup = React.useCallback(() => {
        setOpenPoup(!openPopup);
    }, [openPopup]);

    return { openPopup, onChangeOpenPopup };
}
