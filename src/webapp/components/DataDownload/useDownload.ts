import React from "react";
import { format } from "date-fns";
import i18next from "i18next";
import {
    mapDiagnosisStudiesToCSV,
    mapInvasiveStudiesToCSV,
    mapPreventionStudiesToCSV,
    mapTreatmentStudiesToCSV,
} from "./mappers/cvsMapper";
import { exportToCSV, Tab } from "./download";
import { emailRegexp } from "../Subscription";
import { DatabaseSelection, Download, TermsInfo, UserInfo } from "./types";
import { ActionCreatorTypeMetadata, PayloadActionCreator } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { Source } from "../../store/actions/base-actions";

export function useDownload(
    logEvent: any,
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
    addDownload: PayloadActionCreator<ActionTypeEnum.AddDownloadRequest, Download>
) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [downloading, setDownloading] = React.useState(false);
    const [messageLoader, setMessageLoader] = React.useState("");

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

    const onChangeTermsInfo = (field: keyof TermsInfo, value: any) => {
        setTermsInfo({ ...termsInfo, [field]: value });
    };
    const onChangeUserInfo = (field: keyof UserInfo, value: any) => {
        setUserInfo({ ...userInfo, [field]: value });
    };

    const onChangeSelectedDatabases = (databases: DatabaseSelection[]) => {
        setSelectedDatabases(databases);
    };

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const downloadData = () => {
        // setDownloading(true);
        setMessageLoader(i18next.t("common.data_download.loader.fetching_data"));
        setTimeout(() => {
            const request: Download = {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                organizationType: i18next.t(`common.${userInfo.organizationType}`),
                organizationName: userInfo.organizationName,
                uses: userInfo.uses,
                country: userInfo.country,
                email: userInfo.email,
                contactConsent: userInfo.contactConsent,
                organisationProjectConsent: userInfo.piConsent,
                theme: selectedDataBases.map(database => database.kind).join(","),
                dataset: selectedDataBases.map(database => database.dataset).join(","),
                position: "N/A", // TODO: Old field in backend
                researchInfo: "N/A", // TODO: Old field in backend
                policiesInfo: "N/A", // TODO: Old field in backend
                toolsInfo: "N/A", // TODO: Old field in backend
                implementationCountries: "N/A", // TODO: Old field in backend
                date: new Date().toISOString().slice(0, 10), // TODO: Old field in backend
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
    };

    const changeLoaderAndExportToCSV = (tabs: Tab[], filename: string) => {
        setMessageLoader(i18next.t("common.data_download.loader.generating_file"));
        setTimeout(() => {
            exportToCSV(tabs, filename);
            setDownloading(false);
        }, 100);
    };

    const isWelcomeFormValid = () => {
        return termsInfo.agreement;
    };

    const isUserFormValid = () => {
        return (
            userInfo.firstName &&
            userInfo.lastName &&
            userInfo.uses &&
            userInfo.country &&
            userInfo.organizationType &&
            userInfo.organizationName &&
            emailRegexp.test(userInfo.email)
        );
    };
    const isStepValid = () => {
        switch (activeStep) {
            case 0:
                return isDownloadFormValid();
            case 1:
                return isDownloadFormValid() && isUserFormValid();
            case 2:
                return isDownloadFormValid() && isUserFormValid() && isWelcomeFormValid();
        }
    };

    const isFormValid = () => isWelcomeFormValid() && isUserFormValid() && isDownloadFormValid();

    const isDownloadFormValid = () => selectedDataBases.length > 0;

    return {
        activeStep,
        downloading,
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
