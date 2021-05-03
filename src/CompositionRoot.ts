import config from "./webapp/config";
import { UseCase } from "./domain/common/UseCase";
import { PreventionApiRepository } from "./data/repositories/PreventionApiRepository";
import { GetPreventionStudiesUseCase } from "./domain/usecases/GetPreventionStudiesUseCase";
import { DiagnosisApiRepository } from "./data/repositories/DiagnosisApiRepository";
import { GetDiagnosisStudiesUseCase } from "./domain/usecases/GetDiagnosisStudiesUseCase";
import { TreatmentApiRepository } from "./data/repositories/TreatmentApiRepository";
import { GetTreatmentStudiesUseCase } from "./domain/usecases/GetTreatmentStudiesUseCase";
import { InvasiveApiRepository } from "./data/repositories/InvasiveApiRepository";
import { GetInvasiveStudiesUseCase } from "./domain/usecases/GetInvasiveStudiesUseCase";

export class CompositionRoot {
    private preventionRepository = new PreventionApiRepository(config.mapServerUrl);
    private diagnosisRepository = new DiagnosisApiRepository(config.mapServerUrl);
    private treatmentRepository = new TreatmentApiRepository(config.mapServerUrl);
    private invasiveRepository = new InvasiveApiRepository(config.mapServerUrl);

    public get prevention() {
        return getExecute({
            getStudies: new GetPreventionStudiesUseCase(this.preventionRepository),
        });
    }

    public get diagnosis() {
        return getExecute({
            getStudies: new GetDiagnosisStudiesUseCase(this.diagnosisRepository),
        });
    }

    public get treatment() {
        return getExecute({
            getStudies: new GetTreatmentStudiesUseCase(this.treatmentRepository),
        });
    }

    public get invasive() {
        return getExecute({
            getStudies: new GetInvasiveStudiesUseCase(this.invasiveRepository),
        });
    }
}

function getExecute<UseCases extends Record<Key, UseCase>, Key extends keyof UseCases>(
    useCases: UseCases
): { [K in Key]: UseCases[K]["execute"] } {
    const keys = Object.keys(useCases) as Key[];
    const initialOutput = {} as { [K in Key]: UseCases[K]["execute"] };

    return keys.reduce((output, key) => {
        const useCase = useCases[key];
        const execute = useCase.execute.bind(useCase) as UseCases[typeof key]["execute"];
        output[key] = execute;
        return output;
    }, initialOutput);
}
