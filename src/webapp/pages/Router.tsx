import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./home/HomePage";
import { AboutPage } from "./about/AboutPage";


export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />


                {/* Default route */}
                <Route element={<HomePage />} />
            </Routes>
        </HashRouter>
    );
});
