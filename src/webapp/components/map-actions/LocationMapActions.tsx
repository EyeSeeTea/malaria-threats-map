import React, { useMemo } from "react";

import { connect } from "react-redux";
import CountrySelector from "../filters/CountrySelector";
import RegionSelector from "../filters/RegionSelector";
import SiteSelector from "../filters/SiteSelector";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { selectRegion } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { getLocation } from "./utils";
import { Box } from "@mui/material";

const Label = styled.span`
    font-weight: bold;
`;

const Value = styled.span`
    font-weight: normal;
`;

const mapStateToProps = (state: State) => ({
    region: selectRegion(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const LocationMapActions: React.FC<StateProps> = ({ region }) => {
    const { t } = useTranslation();

    const selectedRegion = useMemo(() => {
        return getLocation(region);
    }, [region]);

    return (
        <Box id="locationFilters">
            <ActionGroupItem
                placeholder={t("mapActions.selectLocation")}
                actionGroupKey={"LOCATION"}
                value={
                    selectedRegion && (
                        <span>
                            <Label>{t("mapActions.location")}:&nbsp;</Label>
                            <Value>{t(selectedRegion)}</Value>
                        </span>
                    )
                }
            >
                <>
                    <RegionSelector />
                    <CountrySelector />
                    <SiteSelector />
                </>
            </ActionGroupItem>
        </Box>
    );
};

export default connect(mapStateToProps)(LocationMapActions);
