import { Signal } from "@preact/signals-core";

export type QueryResult<T> = {
    data: Signal<T>;
    isLoading: Signal<boolean>;
    error?: Signal<Error | string | null | unknown>;
    dispose?: () => void;
}

export interface IViewModel {
    dispose: () => void;
}