import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./home/HomePage";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";

export const Router: React.FC = React.memo(() => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="maps" element={<PersistentDrawerLeft />} />

                {/* Default route */}
                <Route element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
});
