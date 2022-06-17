import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MainContainer = styled.main`
    flex: 1;
    padding: 16px;
`;

const Layout: React.FC = ({ children }) => {
    return (
        <Container>
            <Header />

            <MainContainer>{children}</MainContainer>

            <Footer />
        </Container>
    );
};

export default Layout;
