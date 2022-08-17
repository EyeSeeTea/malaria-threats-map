import React from "react";
import { format } from "date-fns";
import i18next from "i18next";
import { PreventionStudy } from "../../../domain/entities/PreventionStudy";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import { InvasiveStudy } from "../../../domain/entities/InvasiveStudy";
import { mapInvasiveStudiesToCSV, mapPreventionStudiesToCSV, mapTreatmentStudiesToCSV } from "./mappers/cvsMapper";
import { addDataDownloadRequestAction } from "../../store/actions/data-download-actions";
import { exportToCSV, Tab } from "./download";
import { logEventAction } from "../../store/actions/base-actions";
import { emailRegexp } from "../Subscription";
import { DataInfo, Download, TermsInfo, UserInfo } from "./types";

export function useDownload(logEvent: any, addDownload: any) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [downloading, setDownloading] = React.useState(false);
    const [messageLoader, setMessageLoader] = React.useState("");

    const [termsInfo, setTermsInfo] = React.useState<Partial<TermsInfo>>({});
    const [userInfo, setUserInfo] = React.useState<Partial<UserInfo>>({
        contactConsent: false,
        piConsent: false,
    });

    const [dataInfo, setDataInfo] = React.useState({
        theme: "prevention",
        preventionDataset: undefined,
        treatmentDataset: undefined,
        invasiveDataset: undefined,
        insecticideClasses: [],
        insecticideTypes: [],
        mechanismTypes: [],
        molecularMarkers: [],
        types: [],
        synergistTypes: [],
        plasmodiumSpecies: [],
        species: [],
        drugs: [],
        years: [],
        countries: [],
    });

    React.useEffect(() => {
        logEvent({
            category: "download",
            action: "step",
            label: (activeStep + 1).toString(),
        });
    }, [activeStep]);

    const onChangeTermsInfo = (field: keyof TermsInfo, value: any) => {
        setTermsInfo({ ...termsInfo, [field]: value });
    };
    const onChangeUserInfo = (field: keyof UserInfo, value: any) => {
        setUserInfo({ ...userInfo, [field]: value });
    };

    const onChangeDataInfo = (dataInfo: DataInfo) => {
        setDataInfo({ ...dataInfo });
    };

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const downloadData = (
        preventionStudies: PreventionStudy[],
        treatmentStudies: TreatmentStudy[],
        invasiveStudies: InvasiveStudy[]
    ) => {
        setDownloading(true);
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
                theme: dataInfo.theme,
                dataset: i18next.t(
                    `common.${dataInfo.preventionDataset || dataInfo.treatmentDataset || dataInfo.invasiveDataset}`
                ),
                position: "N/A", // TODO: Old field in backend
                researchInfo: "N/A", // TODO: Old field in backend
                policiesInfo: "N/A", // TODO: Old field in backend
                toolsInfo: "N/A", // TODO: Old field in backend
                implementationCountries: "N/A", // TODO: Old field in backend
                date: new Date().toISOString().slice(0, 10), // TODO: Old field in backend
            };

            const dateString = format(new Date(), "yyyyMMdd");

            let dataset;
            switch (dataInfo.theme) {
                case "prevention": {
                    const preventionTabs = mapPreventionStudiesToCSV(preventionStudies, dataInfo);
                    dataset = dataInfo.preventionDataset;
                    changeLoaderAndExportToCSV(preventionTabs, `MTM_${dataInfo.preventionDataset}_${dateString}`);
                    break;
                }
                case "treatment": {
                    const treatmentTabs = mapTreatmentStudiesToCSV(treatmentStudies, dataInfo);
                    dataset = dataInfo.treatmentDataset;
                    changeLoaderAndExportToCSV(treatmentTabs, `MTM_${dataInfo.treatmentDataset}_${dateString}`);
                    break;
                }
                case "invasive": {
                    const invasiveTabs = mapInvasiveStudiesToCSV(invasiveStudies, dataInfo);
                    dataset = dataInfo.invasiveDataset;
                    changeLoaderAndExportToCSV(invasiveTabs, `MTM_${dataInfo.invasiveDataset}_${dateString}`);
                    break;
                }
            }

            addDownload(request);

            logEvent({ category: "Download", action: "download", label: dataset || undefined });
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

    const isDownloadFormValid = () => {
        return (
            (dataInfo.theme === "prevention" && dataInfo.preventionDataset) ||
            (dataInfo.theme === "treatment" && dataInfo.treatmentDataset) ||
            (dataInfo.theme === "invasive" && dataInfo.invasiveDataset)
        );
    };

    return {
        activeStep,
        downloading,
        messageLoader,
        dataInfo,
        userInfo,
        termsInfo,
        isStepValid,
        isFormValid,
        downloadData,
        handleNext,
        handleBack,
        onChangeDataInfo,
        onChangeUserInfo,
        onChangeTermsInfo,
    };
}
