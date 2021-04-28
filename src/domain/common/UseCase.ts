export interface UseCase {
    execute(...args: unknown[]): unknown;
}