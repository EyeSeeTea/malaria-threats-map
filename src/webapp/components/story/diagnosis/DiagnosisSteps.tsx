import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const createStep = (key: string) => {
    const DiagnosisStep = () => {
        const { t } = useTranslation();

        return (
            <div>
                <ReactMarkdown>{t(key)}</ReactMarkdown>
            </div>
        );
    };

    return DiagnosisStep;
};

const DiagnosisSteps = ["diagnosisStory_step1", "diagnosisStory_step2", "diagnosisStory_step3"].map(createStep);

export default DiagnosisSteps;
