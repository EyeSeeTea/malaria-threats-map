import React from "react";
import styled from "styled-components";
import Footer from "./Footer";
import { Divider } from "@mui/material";
import Header from "./Header";

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MainContainer = styled.main`
    flex: 1;
    padding-top: 55px;
    min-height: 100vh;
`;

const Layout: React.FC = ({ children }) => {
    return (
        <Container>
            <Header />

            <MainContainer>{children}</MainContainer>

            <Divider />
            <Footer />
        </Container>
    );
};

export default Layout;
