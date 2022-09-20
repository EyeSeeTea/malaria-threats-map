import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./home/HomePage";
import { AboutPage } from "./about/AboutPage";
import MapPage from "./map/MapPage";
import ContactPage from "./contact/ContactPage";
import config from "../config";
import { DownloadPage } from "./download/DownloadPage";
import { StoriesPage } from "./stories/StoriesPage";

export const Router: React.FC = React.memo(() => {
    return (
        <BrowserRouter basename={config.publicUrl}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route path="/maps" element={<MapPage />} />
                <Route path="/download" element={<DownloadPage />} />
                <Route path="/stories" element={<StoriesPage />} />

                {/* Default route */}
                <Route element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
});
