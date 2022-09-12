import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

export const createStoryStep = (key: string) => {
    const Step = () => {
        const { t } = useTranslation();

        return (
            <div>
                <ReactMarkdown>{t(key)}</ReactMarkdown>
            </div>
        );
    };

    return Step;
};
