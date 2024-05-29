import React from "react";
import DashboardProvider from "./context/DashboardProvider";

import DashboardsPageContent from "./DashboardsPageContent";
import { useSendAnalyticsPageView } from "../../hooks/useSendAnalyticsPageView";

const DashboardsPage: React.FC = () => {
    useSendAnalyticsPageView();

    return (
        <DashboardProvider>
            <DashboardsPageContent />
        </DashboardProvider>
    );
};

export default DashboardsPage;
