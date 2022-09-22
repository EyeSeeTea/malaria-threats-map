import React from "react";

import Layout from "../layout/Layout";
import BannerSection from "./BannerSection";
import ChallengesSection from "./ChallengesSection";
import DataSection from "./DataSection";
import MapSection from "./MapSection";
import UserExperience from "./UserExperienceSection";

export const AboutPage: React.FC = () => {
    return (
        <Layout>
            <BannerSection />
            <DataSection />
            <MapSection />
            <ChallengesSection />
            <UserExperience />
        </Layout>
    );
};
