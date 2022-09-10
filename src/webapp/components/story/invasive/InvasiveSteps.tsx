import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const createStep = (key: string) => {
    const InvasiveStep = () => {
        const { t } = useTranslation();

        return (
            <div>
                <ReactMarkdown>{t(key)}</ReactMarkdown>
            </div>
        );
    };

    return InvasiveStep;
};

const InvasiveSteps = ["invasiveStory_step1", "invasiveStory_step2", "invasiveStory_step3"].map(createStep);

export default InvasiveSteps;
