import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { HomePage } from "./home/HomePage";
//<Route path="/apply" element={() => <HomePage />} />

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Routes>
            <Route path="/" element={<HomePage />} />

                {/* Default route */}
                <Route element={<HomePage />} />
            </Routes>
        </HashRouter>
    );
});

const Container = styled.div`
    margin: 15px;
`;
