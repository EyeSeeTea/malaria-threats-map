import React from "react";
import DashboardProvider from "./context/DashboardProvider";

import DashboardsPageContent from "./DashboardsPageContent";

const DashboardsPage: React.FC = () => {
    return (
        <DashboardProvider>
            <DashboardsPageContent />
        </DashboardProvider>
    );
};

export default DashboardsPage;
