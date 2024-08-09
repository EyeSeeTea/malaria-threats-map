import { FutureData } from "../common/FutureData";
import { DashboardSourceInfo } from "../entities/DashboardSourceInfo";

export interface DashboardSourceInfoRepository {
    get(): FutureData<DashboardSourceInfo[]>;
}
