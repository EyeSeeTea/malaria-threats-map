import { LastUpdatedDates } from "../../../domain/entities/LastUpdateDates";

export function useLastUpdatedDatesByTheme(lastUpdatedDates: LastUpdatedDates, theme: string) {
    switch (theme) {
        case "prevention":
            return lastUpdatedDates.VIR_DIS;
        case "diagnosis":
            return lastUpdatedDates.HRP;
        case "treatment":
            return lastUpdatedDates.AMDER_TES;
        case "invasive":
            return lastUpdatedDates.INV;
    }
}
