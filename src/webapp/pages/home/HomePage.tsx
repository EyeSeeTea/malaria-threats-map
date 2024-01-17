import React from "react";

import Layout from "../layout/Layout";
import BannerSection from "./BannerSection";
import LinkCardsSection from "./LinkCardsSection";
import ThemesSection from "./ThemesSection";
import { useSendAnalyticsPageView } from "../../hooks/useSendAnalyticsPageView";

const HomePage: React.FC = () => {
    useSendAnalyticsPageView("home");
    return (
        <Layout>
            <BannerSection />
            <LinkCardsSection />
            <ThemesSection />
        </Layout>
    );
};

export default HomePage;
