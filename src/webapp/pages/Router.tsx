import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./home/HomePage";

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
