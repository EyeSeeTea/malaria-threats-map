import React from "react";

import Layout from "../layout/Layout";
import BannerSection from "./BannerSection";
//import ChallengesSection from "./ChallengesSection";
import DataSection from "./DataSection";
import MapSection from "./MapSection";
import UserExperience from "./UserExperienceSection";

/* const StyledDivider = styled(Divider)`
    width: 100%;
    margin-top: 60px;
    background-color: #a1c5b7;
`; */

export const AboutPage: React.FC = () => {
    return (
        <Layout>
            <BannerSection />
            <DataSection />
            <MapSection />
            {/*
              * Temporarily hide Challenges Section
              *
                <ChallengesSection />
                <StyledDivider variant="fullWidth" />
            */}
            <UserExperience />
        </Layout>
    );
};
