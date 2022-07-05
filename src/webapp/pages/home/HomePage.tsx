import React from "react";

import Layout from "../layout/Layout";
import BannerSection from "./BannerSection";
import LinkCardsSection from "./LinkCardsSection";

const HomePage: React.FC = () => {
    return (
        <Layout>
            <BannerSection />
            <LinkCardsSection />
        </Layout>
    );
};

export default HomePage;
