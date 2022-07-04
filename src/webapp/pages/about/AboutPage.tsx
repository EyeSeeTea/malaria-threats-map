import React from "react";

import Layout from "../layout/Layout";
import BannerSection from "./BannerSection";
import DataSection from "./DataSection";

export interface StyledImgProps {
    maxWidth: number;
    maxHeight: number;
}

export interface WindowProps {
    windowWidth: number;
}

export const AboutPage: React.FC = () => {
    return (
        <Layout>
            <BannerSection />
            <DataSection />
        </Layout>

        // <React.Fragment>
        //     <StyledBanner>
        //         <Header />
        //         <BannerContentDiv windowWidth={width}>
        //             <Typography variant="h3" color="inherit" textTransform="uppercase">
        //                 Learn More About <br /> <strong>The Malaria Threats Map</strong>
        //             </Typography>
        //         </BannerContentDiv>
        //     </StyledBanner>
        //     <DataOrigin width={width} />
        //     <MapFunctionality width={width} />
        //     <Challenges width={width} />
        //     <UserExperience width={width} />
        //     <Footer />
        // </React.Fragment>
    );
};
