import React from "react";
import DataDownload from "../../components/DataDownload";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import { useSendAnalyticsPageView } from "../../hooks/useSendAnalyticsPageView";

export const DownloadPage: React.FC = () => {
    useSendAnalyticsPageView("downloads");

    return (
        <SecondaryLayout>
            <DataDownload />
        </SecondaryLayout>
    );
};
