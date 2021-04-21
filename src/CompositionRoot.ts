import { UseCase } from "./domain/common/UseCase";
import { PreventionApiRepository } from "./data/repositories/PreventionApiRepository";
import config from "./webapp/config";
import { GetPreventionStudiesUseCase } from "./domain/usecases/GetPreventionStudiesUseCase";

export class CompositionRoot {
    private preventionRepository = new PreventionApiRepository(config.mapServerUrl);

    public get prevention() {
        return getExecute({
            getStudies: new GetPreventionStudiesUseCase(this.preventionRepository),
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
