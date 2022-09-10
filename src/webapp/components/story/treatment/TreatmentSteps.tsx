import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const createStep = (key: string) => {
    const TreatmentStep = () => {
        const { t } = useTranslation();

        return (
            <div>
                <ReactMarkdown>{t(key)}</ReactMarkdown>
            </div>
        );
    };

    return TreatmentStep;
};

const TreatmentSteps = [
    "treatmentStory_step1",
    "treatmentStory_step2",
    "treatmentStory_step3",
    "treatmentStory_step4",
].map(createStep);

export default TreatmentSteps;
