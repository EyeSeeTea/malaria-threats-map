import React, { useCallback } from "react";
import { format } from "date-fns";
import { TFunction } from "i18next";
import {
    mapDiagnosisStudiesToCSV,
    mapInvasiveStudiesToCSV,
    mapPreventionStudiesToCSV,
    mapTreatmentStudiesToCSV,
} from "./mappers/cvsMapper";
import { exportToCSV, Tab } from "./download";
import { DatabaseSelection, TermsInfo, UserInfo } from "./types";
import { ActionCreatorTypeMetadata, PayloadActionCreator } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { GAEvent, Source } from "../../store/actions/base-actions";
import { emailRegexp } from "../../../domain/common/regex";
import { ActionGroup } from "../../store/types";
import { Download } from "../../../domain/entities/Download";

export function useDownload(
    logEvent: PayloadActionCreator<ActionTypeEnum.MalariaLogEvent, GAEvent>,
    setTheme: ((
        theme: string,
        options?: Source
    ) => {
        type: ActionTypeEnum.MalariaSetTheme;
        payload: string;
        from: Source;
    }) &
        ActionCreatorTypeMetadata<ActionTypeEnum.MalariaSetTheme>,
    setPreventionDataset: PayloadActionCreator<ActionTypeEnum.SetPreventionDataset, string>,
    addDownload: PayloadActionCreator<ActionTypeEnum.AddDownloadRequest, Download>,
    setActionGroupSelected: PayloadActionCreator<ActionTypeEnum.MalariaActionGroupSelected, ActionGroup>,
    t: TFunction
) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [messageLoader, setMessageLoader] = React.useState<string | undefined>("");

    const [termsInfo, setTermsInfo] = React.useState<Partial<TermsInfo>>({});
    const [userInfo, setUserInfo] = React.useState<Partial<UserInfo>>({
        contactConsent: false,
        piConsent: false,
    });

    const [selectedDataBases, setSelectedDatabases] = React.useState<DatabaseSelection[]>([]);

    React.useEffect(() => {
        logEvent({
            category: "download",
            action: "step",
            label: (activeStep + 1).toString(),
        });
    }, [activeStep, logEvent]);

    React.useEffect(() => {
        setTheme("prevention", "download");
    }, [setTheme, setPreventionDataset]);

    const onChangeTermsInfo = useCallback(
        (field: keyof TermsInfo, value: any) => {
            setTermsInfo({ ...termsInfo, [field]: value });
        },
        [termsInfo]
    );

    const onChangeUserInfo = useCallback(
        (field: keyof UserInfo, value: any) => {
            setUserInfo({ ...userInfo, [field]: value });
        },
        [userInfo]
    );

    const onChangeSelectedDatabases = useCallback(
        (databases: DatabaseSelection[]) => {
            setSelectedDatabases(databases);
            setTheme("prevention", "download");
            setActionGroupSelected("THEME");
        },
        [setActionGroupSelected, setTheme]
    );

    const handleNext = useCallback(() => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }, []);

    const changeLoaderAndExportToCSV = useCallback(
        (tabs: Tab[], filename: string) => {
            setMessageLoader(t("common.data_download.loader.generating_file"));
            setTimeout(() => {
                exportToCSV(tabs, filename);
            }, 100);
        },
        [t]
    );

    const downloadData = useCallback(() => {
        // setDownloading(true);
        setMessageLoader(t("common.data_download.loader.fetching_data"));
        setTimeout(() => {
            const request: Download = {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                organizationType: userInfo.organizationType,
                organizationName: userInfo.organizationName,
                uses: userInfo.uses,
                country: userInfo.country,
                email: userInfo.email,
                contactConsent: userInfo.contactConsent,
                theme: selectedDataBases.map(database => database.kind).join(","),
                dataset: selectedDataBases.map(database => database.dataset).join(","),
                date: new Date().toISOString().slice(0, 10),
            };
            const dateString = format(new Date(), "yyyyMMdd");

            for (const database of selectedDataBases) {
                switch (database.kind) {
                    case "prevention": {
                        const preventionTabs = mapPreventionStudiesToCSV(database);
                        changeLoaderAndExportToCSV(preventionTabs, `MTM_${database.dataset}_${dateString}`);
                        break;
                    }
                    case "diagnosis": {
                        const diagnosisTabs = mapDiagnosisStudiesToCSV(database);
                        changeLoaderAndExportToCSV(diagnosisTabs, `MTM_${database.dataset}_${dateString}`);
                        break;
                    }
                    case "treatment": {
                        const treatmentTabs = mapTreatmentStudiesToCSV(database);
                        changeLoaderAndExportToCSV(treatmentTabs, `MTM_${database.dataset}_${dateString}`);
                        break;
                    }
                    case "invasive": {
                        const invasiveTabs = mapInvasiveStudiesToCSV(database);
                        changeLoaderAndExportToCSV(invasiveTabs, `MTM_${database.dataset}_${dateString}`);
                        break;
                    }
                }

                logEvent({ category: "Download", action: "download", label: database.dataset || undefined });
            }

            addDownload(request);
        }, 100);
    }, [
        addDownload,
        changeLoaderAndExportToCSV,
        logEvent,
        selectedDataBases,
        t,
        userInfo.contactConsent,
        userInfo.country,
        userInfo.email,
        userInfo.firstName,
        userInfo.lastName,
        userInfo.organizationName,
        userInfo.organizationType,
        userInfo.uses,
    ]);

    const isStepValid = useCallback(() => {
        switch (activeStep) {
            case 0:
                return isDownloadFormValid(selectedDataBases);
            case 1:
                return isDownloadFormValid(selectedDataBases) && isUserFormValid(userInfo);
            case 2:
                return (
                    isDownloadFormValid(selectedDataBases) && isUserFormValid(userInfo) && isWelcomeFormValid(termsInfo)
                );
        }
    }, [activeStep, selectedDataBases, termsInfo, userInfo]);

    const isFormValid = useCallback(
        () => isWelcomeFormValid(termsInfo) && isUserFormValid(userInfo) && isDownloadFormValid(selectedDataBases),
        [selectedDataBases, termsInfo, userInfo]
    );

    return {
        activeStep,
        messageLoader,
        selectedDataBases,
        userInfo,
        termsInfo,
        isStepValid,
        isFormValid,
        downloadData,
        handleNext,
        handleBack,
        onChangeSelectedDatabases,
        onChangeUserInfo,
        onChangeTermsInfo,
    };
}

const isWelcomeFormValid = (termsInfo: Partial<TermsInfo>) => {
    return termsInfo.agreement;
};

const isUserFormValid = (userInfo: Partial<UserInfo>) => {
    return emailRegexp.test(userInfo.email) || !userInfo.email;
};

const isDownloadFormValid = (selectedDataBases: DatabaseSelection[]) => selectedDataBases.length > 0;
