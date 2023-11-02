import React from "react";

export function useFiltersVisible() {
    const [filtersVisible, setFiltersVisible] = React.useState<boolean>(true);

    const onChangeFiltersVisible = React.useCallback(() => {
        setFiltersVisible(!filtersVisible);
    }, [filtersVisible]);

    return { filtersVisible, onChangeFiltersVisible };
}
