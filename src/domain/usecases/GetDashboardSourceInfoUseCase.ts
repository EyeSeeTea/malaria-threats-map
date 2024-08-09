import { FutureData } from "../common/FutureData";
import { DashboardSourceInfo } from "../entities/DashboardSourceInfo";
import { DashboardSourceInfoRepository } from "../repositories/DashboardSourceInfoRepository";

export class GetDashboardSourceInfoUseCase {
    constructor(private dashboardSourceInfoRepository: DashboardSourceInfoRepository) {}

    execute(): FutureData<DashboardSourceInfo[]> {
        return this.dashboardSourceInfoRepository.get();
    }
}
