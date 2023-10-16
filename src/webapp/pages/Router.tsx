import React, { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AboutPage } from "./about/AboutPage";
import ContactPage from "./contact/ContactPage";
import DashboardsPage from "./dashboards/DashboardsPage";
import { DownloadPage } from "./download/DownloadPage";
import { StoriesPage } from "./stories/StoriesPage";
import HomePage from "./home/HomePage";
import MapPage from "./map/MapPage";
import ShareDataPage from "./shareData/ShareDataPage";
import DisplaySuggestionModal from "../components/DisplaySuggestionModal";

const ScrollToTop = (): JSX.Element => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export const Router: React.FC = React.memo(() => {
    return (
        <HashRouter>
            <ScrollToTop />
            <DisplaySuggestionModal />
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
        </HashRouter>
    );
});
