import React from "react";
import Dialog from "@mui/material/Dialog";
import styled from "styled-components";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Container, Typography } from "@mui/material";
import { Fade, Button, AppBar, Toolbar, Box } from "@mui/material";
import HomepageMap from "../../assets/img/homepage-map.png";

const FlexGrow = styled.div`
    flex-grow: 1;
`;
const Row = styled.div`
    display: flex;
`;

const CenteredRow = styled(Row)`
    align-items: center;
    min-width: 20px;
`;

const Column = styled.div`
    padding-left: 10px;
    padding-right: 10px;
`;

const LanguageWrapper = styled.div`
    max-width: 200px;
`;

const WhiteColumn = styled(Column)`
    color: white;
`;

const StyledToolbar = styled(Toolbar)`
    &.MuiToolbar-root {
        padding: 0;
        @media (min-width: 600px) {
            padding: 0 70px;
            min-height: 50px;
        }
    }
`;

const StyledButton = styled(Button)`
    &.MuiButton-root {
        padding: 15px 20px;
        color: black;
        letter-spacing: 0.235px;
        &:hover {
            border: none;
            color: #2FB3AF;
            font-weight: bold;
            padding-bottom: 10px;
            letter-spacing: 0;
            border-bottom: 5px solid #2FB3AF;
            border-radius: 0;
            cursor;
            transition: none;
        }
    }
`;
const StyledImage = styled.img`
    -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    mask-image: linear-gradient(90deg, #BBD7E8 0%, #BBD7E800 100%);
`;

export const HomePage = () => {
    const { t } = useTranslation("common");
    const classes = {
        icon: { marginRight: 5 },
        menuOptionBox: { flexGrow: 1, display: { xs: "flex" } },
        screenshotBox: { flexGrow: 0 },
        appBar: { backgroundColor: "white" },
    };
    //            <img src={HomepageMap} width={1330} alt="WHO spanish logo" />;

    return (
        <React.Fragment>
            <div style={{ position: "absolute", bottom: 0, top: 0, right: 0, left: 0 }}>
            <Box>
                <AppBar position="sticky" sx={classes.appBar}>
                    <StyledToolbar>
                        <Box sx={classes.menuOptionBox}>
                            <StyledButton>Menu</StyledButton>
                            <StyledButton>Tools</StyledButton>
                            <StyledButton>About</StyledButton>
                            <StyledButton>Contact</StyledButton>
                            <StyledButton>Share Data</StyledButton>
                        </Box>
                        <Box sx={classes.screenshotBox}>
                        <StyledButton>English</StyledButton>
                        </Box>
                    </StyledToolbar>
                </AppBar>
            </Box>
            <div style={{display: "block", left: 0, width: "100%", background: `linear-gradient(90deg, #BBD7E8 0%, #BBD7E800 100%), url(${HomepageMap}`, height: 717, opacity: 1}}>


            </div>
            </div>
        </React.Fragment>
    );
}
//            <h1>Hello! </h1>
//                    <StyledImage src={HomepageMap} alt="WHO spanish logo" />
        


