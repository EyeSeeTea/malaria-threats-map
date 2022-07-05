import React from "react";

import Layout from "../layout/Layout";
import BannerSection from "./BannerSection";
import LinkCardsSection from "./LinkCardsSection";
import ThemesSection from "./ThemesSection";

const HomePage: React.FC = () => {
    return (
        <Layout>
            <BannerSection />
            <LinkCardsSection />
            <ThemesSection />
        </Layout>
    );
};

export default HomePage;
