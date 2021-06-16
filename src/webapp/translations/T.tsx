import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
    i18nKey: string;
    args?: any;
}

function T({ i18nKey, args }: Props) {
    const { t } = useTranslation();
    return <>{t(i18nKey, args)}</>;
}

export default T;
