import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const createStep = (key: string) => {
    const PreventionStep = () => {
        const { t } = useTranslation();

        return (
            <div>
                <ReactMarkdown>{t(key)}</ReactMarkdown>
            </div>
        );
    };

    return PreventionStep;
};

const PreventionSteps = [
    "preventionStory_step1",
    "preventionStory_step2",
    "preventionStory_step3",
    "preventionStory_step4",
].map(createStep);

export default PreventionSteps;
