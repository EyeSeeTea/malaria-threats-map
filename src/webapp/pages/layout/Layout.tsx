import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import { Divider } from "@mui/material";

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MainContainer = styled.main`
    flex: 1;
    padding-top: 55px;
    height: 100vh;
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
