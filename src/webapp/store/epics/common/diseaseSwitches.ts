import { Observable } from "rxjs";
import { filter, map, pairwise, startWith } from "rxjs/operators";
import { isDiseaseSwitch } from "../../../../domain/entities/Disease";

type DiseaseChange = [previous: string | undefined, next: string];

/**
 * The diseases a theme switches to. The first time a disease is set, from the URL or from the
 * loaded studies, is not a switch, and neither is an unset.
 */
export function diseaseSwitches(diseases$: Observable<string | undefined>): Observable<string> {
    return diseases$.pipe(
        startWith(undefined),
        pairwise(),
        filter((change): change is DiseaseChange => isDiseaseSwitch(change[0], change[1])),
        map(([, next]) => next)
    );
}
