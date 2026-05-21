import * as XLSX from "xlsx";
import { request } from "../common/request";
import { FutureData } from "../../domain/common/FutureData";
import { PreventionStudy } from "../../domain/entities/PreventionStudy";
import { PreventionRepository } from "../../domain/repositories/PreventionRepository";
import { XMartApiResponse } from "../common/types";

export class PreventionApiRepository implements PreventionRepository {
    constructor(private xmartBaseUrl: string) {}

    getStudies(): FutureData<PreventionStudy[]> {
        return request<string>({
            url: `${this.xmartBaseUrl}/FACT_PREVENTION_VIEW?$format=csv`,
        }).map(response => {
            const jsonData = this.mapCsvToJsonData(response);
            return this.buildPreventionStudiesFromJson(jsonData);
        });
    }

    getResistanceStatusTypeStudies(): FutureData<PreventionStudy[]> {
        return request<XMartApiResponse<XMartPreventionStudy>>({
            url: `${this.xmartBaseUrl}/FACT_VIR_DIS_VIEW`,
        }).map(response => this.buildPreventionStudies(response.value));
    }

    getResistanceIntensityTypeStudies(): FutureData<PreventionStudy[]> {
        return request<XMartApiResponse<XMartPreventionStudy>>({
            url: `${this.xmartBaseUrl}/FACT_VIR_INT_VIEW`,
        }).map(response => this.buildPreventionStudies(response.value));
    }

    getResistanceMechanismTypeStudies(): FutureData<PreventionStudy[]> {
        return request<XMartApiResponse<XMartPreventionStudy>>({
            url: `${this.xmartBaseUrl}/FACT_VIR_RESISTANCE_MECHANISM_VIEW`,
        }).map(response => this.buildPreventionStudies(response.value));
    }

    getSynergistEffectTypeStudies(): FutureData<PreventionStudy[]> {
        return request<XMartApiResponse<XMartPreventionStudy>>({
            url: `${this.xmartBaseUrl}/FACT_VIR_SYN_VIEW`,
        }).map(response => this.buildPreventionStudies(response.value));
    }

    private mapCsvToJsonData(csvResponse: string): string[][] {
        const workbook = XLSX.read(csvResponse, { type: "binary", raw: true });
        const sheetName = workbook.SheetNames[0];
        return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, raw: true });
    }

    private buildPreventionStudiesFromJson(jsonData: string[][]): PreventionStudy[] {
        const headers = jsonData[0];
        const dataWithoutHeader = jsonData.slice(1);

        return dataWithoutHeader.map((row): PreventionStudy => {
            return row.reduce((accRow, value, index) => {
                const header = headers[index];
                switch (header) {
                    case "OBJECTID":
                    case "YEAR_START":
                    case "YEAR_END":
                    case "VERSION":
                    case "DOWNLOAD":
                        return { ...accRow, [header]: value !== undefined ? parseInt(value) : null };
                    case "Latitude":
                    case "Longitude":
                    case "INSECTICIDE_INTENSITY":
                        return { ...accRow, [header]: value !== undefined ? parseFloat(value) : null };
                    case "MORTALITY_ADJUSTED":
                        return {
                            ...accRow,
                            [header]: value !== undefined ? (+value / 100).toString() : null,
                        };
                    default:
                        return { ...accRow, [header]: value !== undefined ? value : null };
                }
            }, {} as PreventionStudy);
        });
    }

    private buildPreventionStudies(xMartPreventionStudy: XMartPreventionStudy[]): PreventionStudy[] {
        return xMartPreventionStudy.map(study => ({
            ...study,
            MORTALITY_ADJUSTED:
                study.MORTALITY_ADJUSTED !== undefined ? (+study.MORTALITY_ADJUSTED / 100).toString() : null,
        }));
    }
}

type XMartPreventionStudy = Omit<PreventionStudy, "MORTALITY_ADJUSTED"> & { MORTALITY_ADJUSTED: string | number };
