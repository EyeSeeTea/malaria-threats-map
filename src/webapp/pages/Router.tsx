import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import ContactPage from "./contact/ContactPage";
import DashboardsPage from "./dashboards/DashboardsPage";
import { DownloadPage } from "./download/DownloadPage";
import { StoriesPage } from "./stories/StoriesPage";
import HomePage from "./home/HomePage";
import MapPage from "./map/MapPage";
import ShareDataPage from "./shareData/ShareDataPage";

import config from "../config";

const ScrollToTop = (): JSX.Element => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const Router: React.FC = React.memo(() => {
    return (
        <BrowserRouter basename={config.publicUrl}>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/share-data" element={<ShareDataPage />} />

                <Route path="/maps" element={<MapPage />} />
                <Route path="/download" element={<DownloadPage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/dashboards" element={<DashboardsPage />} />

                {/* Default route */}
                <Route element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
});
