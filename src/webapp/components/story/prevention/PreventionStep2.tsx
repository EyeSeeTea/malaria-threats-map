import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const PreventionStep2 = () => {
    const { t } = useTranslation();

    return (
        <div>
            <ReactMarkdown>
                {t("preventionStory_step2")}
            </ReactMarkdown>
        </div>
    );
};

export default PreventionStep2;
