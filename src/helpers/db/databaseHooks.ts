import { useRxData } from "rxdb-hooks";
import { Page } from "@/helpers/db/schema.ts";
import { RxDocument } from "rxdb";
import { QueryConstructor } from "rxdb-hooks/dist/useRxData";
import { useCallback, useMemo } from "react";

export const usePages = (
    queryConstructor?: QueryConstructor<Page>,
): {
    isFetching: boolean;
    pages: RxDocument<Page>[] | undefined;
} => {
    const query = useMemo<QueryConstructor<Page>>(
        () =>
            queryConstructor
                ? queryConstructor
                : (collection) => collection.find(),
        [queryConstructor],
    );
    const { result: pages, isFetching } = useRxData<Page>("pages", query);
    return { pages, isFetching };
};
export const usePage = (
    id: string,
): {
    isFetching: boolean;
    page: RxDocument<Page> | undefined;
} => {
    const query = useCallback<QueryConstructor<Page>>(
        (collection) => collection.findOne(id),
        [id],
    );
    const { result, isFetching } = useRxData<Page>("pages", query);
    const page = result?.[0];
    return { page, isFetching };
};
