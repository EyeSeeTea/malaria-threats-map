import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const PreventionStep4 = () => {
    const { t } = useTranslation();

    return (
        <div>
            <ReactMarkdown>{t("preventionStory_step4")}</ReactMarkdown>
        </div>
    );
};

export default PreventionStep4;
