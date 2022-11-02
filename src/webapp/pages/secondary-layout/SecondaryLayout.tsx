import React from "react";
import styled from "styled-components";
import Header from "./SecondaryHeader";

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

const SecondaryLayout: React.FC = ({ children }) => {
    return (
        <Container>
            <Header showTakeTour={false} />

            <MainContainer>{children}</MainContainer>
        </Container>
    );
};

export default SecondaryLayout;
