import { Observable } from "rxjs";
import { filter, map, pairwise, startWith } from "rxjs/operators";

type DiseaseChange = [previous: string | undefined, next: string | undefined];

type DiseaseSwitch = [previous: string, next: string];

/** Whether the change goes from one disease to another, not the disease set for the first time or unset. */
function isDiseaseSwitch(change: DiseaseChange): change is DiseaseSwitch {
    const [previous, next] = change;
    return previous !== undefined && next !== undefined && previous !== next;
}

/**
 * The diseases a theme switches to. The first time a disease is set, from the URL or from the
 * loaded studies, is not a switch, and neither is an unset.
 */
export function diseaseSwitches(diseases$: Observable<string | undefined>): Observable<string> {
    return diseases$.pipe(
        startWith(undefined),
        pairwise(),
        filter(isDiseaseSwitch),
        map(([, next]) => next)
    );
}
