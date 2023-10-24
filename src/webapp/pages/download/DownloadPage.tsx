import React from "react";
import DataDownload from "../../components/DataDownload";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";

export const DownloadPage: React.FC = () => {
    return (
        <SecondaryLayout>
            <DataDownload />
        </SecondaryLayout>
    );
};
