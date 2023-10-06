import React from "react";
import mapboxgl from "mapbox-gl";
import _ from "lodash";
import styled from "styled-components";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useTranslation } from "react-i18next";

import { State } from "../store/types";
import { selectMapTitle, selectTheme } from "../store/reducers/base-reducer";
import { useWindowDimensions } from "./hooks/use-window-dimensions";
import ScreenshotModal from "./ScreenshotModal";
import Legend from "./legend/Legend";
import whoLogoWhite from "../assets/img/who-logo-blue.png";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import MapInfoSummaryLegend from "./MapInfoSummaryLegend";
import SelectionDataContent from "./site-selection-content/SelectionDataContent";

const MALARIA_THREATS_MAP_URL = "https://apps.who.int/malaria/maps/threats/";

const fakeFunction = () => {};

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    title: selectMapTitle(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    map: mapboxgl.Map;
    showMapSidebar?: boolean;
};
type MapScreenshotProps = StateProps & OwnProps;

function MapScreenshot({ map, theme, title, showMapSidebar = false }: MapScreenshotProps) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [mapImage, setMapImage] = React.useState(null);
    const { width, height } = useWindowDimensions();

    const Icon = React.useMemo(() => {
        switch (theme) {
            case "prevention":
                return <PreventionIcon selected />;
            case "diagnosis":
                return <DiagnosisIcon selected />;
            case "treatment":
                return <TreatmentIcon selected />;
            default:
                return <InvasiveIcon selected />;
        }
    }, [theme]);

    const handleOpenScreenshot = React.useCallback(() => {
        const imgSrc = map?.getCanvas()?.toDataURL();
        setMapImage(imgSrc);
        setOpen(true);
    }, [map]);

    const handleCloseScreenshot = React.useCallback(() => {
        setOpen(false);
        setMapImage(null);
    }, []);

    React.useEffect(() => {
        if (open) {
            const imgSrc = map?.getCanvas()?.toDataURL();
            setMapImage(imgSrc);
        }
    }, [width, height, map, open]);

    return (
        <>
            <OpenScreenshotButton variant="contained" onClick={handleOpenScreenshot}>
                <StyledCamaraIcon />
                {t("common.screenshot.screenshot")}
            </OpenScreenshotButton>
            <ScreenshotModal open={open} onClose={handleCloseScreenshot} title={title}>
                <>
                    <TitleWrapper>
                        {Icon}
                        <Title>{_.capitalize(title)}</Title>
                    </TitleWrapper>
                    <MapAndSidebarContainer>
                        <MapContainer>
                            <MapInfoSummaryContainer>
                                <MapInfoSummaryLegend />
                            </MapInfoSummaryContainer>
                            <LegendContainer>
                                <Legend />
                            </LegendContainer>
                            <StyledImage alt="Map screenshot" src={mapImage} $hasSidebar={showMapSidebar} />
                        </MapContainer>
                        {showMapSidebar ? (
                            <MapSidebarContainer>
                                <SelectionDataContent onClose={fakeFunction} isScreenshot />
                            </MapSidebarContainer>
                        ) : null}
                    </MapAndSidebarContainer>
                    <WHOInfoContainer>
                        <WHOInfoWrapper>
                            <WHOInfoWrapper>
                                <div>
                                    <StyledSpan>{t("common.screenshot.footer_data_source")}</StyledSpan>
                                    <StyledAnchor href={MALARIA_THREATS_MAP_URL}>
                                        {MALARIA_THREATS_MAP_URL}
                                    </StyledAnchor>
                                </div>
                                <StyledSpan>{t("common.screenshot.footer_production")}</StyledSpan>
                            </WHOInfoWrapper>
                            <StyledParagraph>
                                {t("common.copyright.content", { year: new Date().getFullYear() })}
                            </StyledParagraph>
                        </WHOInfoWrapper>
                        <WHOLogoWrapper>
                            <img alt="WHO logo" src={whoLogoWhite} width={230} height={70} />
                            <WHOLogoSubtitle>
                                {t("common.screenshot.footer_who_logo", { year: new Date().getFullYear() })}
                            </WHOLogoSubtitle>
                        </WHOLogoWrapper>
                    </WHOInfoContainer>
                </>
            </ScreenshotModal>
        </>
    );
}

export default connect(mapStateToProps)(MapScreenshot);

const OpenScreenshotButton = styled(Button)`
    &.MuiButton-root {
        margin-right: 10px;
        background-color: #2fb3af;
        color: white;
    }
`;

const StyledCamaraIcon = styled(CameraAltIcon)`
    margin-right: 5px;
`;

const TitleWrapper = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    box-shadow: 0px 2px 0px #00000029;
    padding: 10px;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    color: #343434;
    margin: 0;
    white-space: nowrap;
`;

const MapContainer = styled.div`
    position: relative;
    height: fit-content;
    width: fit-content;
`;

const MapAndSidebarContainer = styled.div`
    padding: 20px 20px 0 20px;
    display: flex;
`;

const MapSidebarContainer = styled.div`
    padding: 16px 0;
    width: 100%;
    min-width: 500px;
    max-width: 800px;
    border-radius: 0 10px 10px 0;
    background-color: #f3f3f3;
    margin-bottom: 5px;
    .additional-information-link {
        display: none;
    }
`;

const MapInfoSummaryContainer = styled.div`
    position: absolute;
    top: 30px;
    left: 30px;
    width: fit-content;
`;

const LegendContainer = styled.div`
    border-radius: 12px;
    background-color: #ffffff;
    position: absolute;
    bottom: 20px;
    right: 30px;
    div {
        width: fit-content;
        max-width: fit-content;
    }
    span,
    p {
        white-space: nowrap;
    }
    hr,
    .MuiSvgIcon-root {
        display: none;
    }
    .MuiButtonBase-root {
        padding-bottom: 0;
    }
`;

const StyledImage = styled.img<{ $hasSidebar?: boolean }>`
    border-top-left-radius: 10px;
    border-top-right-radius: ${props => (props.$hasSidebar ? "unset" : "10px")};
    border-bottom-right-radius: ${props => (props.$hasSidebar ? "unset" : "10px")};
    border-bottom-left-radius: 10px;
`;

const WHOInfoContainer = styled.div`
    display: flex;
    padding: 20px;
    gap: 20px;
`;

const WHOInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const StyledParagraph = styled.p`
    margin: 0;
    color: #343434;
    opacity: 0.5;
    font-size: 10px;
    letter-spacing: 0px;
`;

const StyledSpan = styled.span`
    font-size: 14px;
    color: #343434;
    letter-spacing: 0px;
`;

const StyledAnchor = styled.a`
    margin-left: 5px;
`;

const WHOLogoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
`;

const WHOLogoSubtitle = styled.span`
    font-size: 12px;
    color: #343434;
    letter-spacing: 0px;
    white-space: nowrap;
`;
