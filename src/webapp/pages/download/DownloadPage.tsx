import React from "react";
import DataDownload from "../../components/DataDownload";
import SecondaryLayout from "../secondary-layout/SecondaryLayout";
import DisplaySuggestionModal from "../../components/DisplaySuggestionModal";

export const DownloadPage: React.FC = () => {
    return (
        <>
            <DisplaySuggestionModal />
            <SecondaryLayout>
                <DataDownload />
            </SecondaryLayout>
        </>
    );
};
