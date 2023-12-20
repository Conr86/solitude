import { useRxData } from "rxdb-hooks";
import { Page } from "@/helpers/schema.ts";
import { RxDocument } from "rxdb";
import { QueryConstructor } from "rxdb-hooks/dist/useRxData";

export const usePages = (
    queryConstructor?: QueryConstructor<Page>,
): {
    isFetching: boolean;
    pages: RxDocument<Page>[] | undefined;
} => {
    const { result: pages, isFetching } = useRxData<Page>(
        "pages",
        queryConstructor ? queryConstructor : (collection) => collection.find(),
    );
    return { pages, isFetching };
};
export const usePage = (
    id: string,
): {
    isFetching: boolean;
    page: RxDocument<Page> | undefined;
} => {
    const { result, isFetching } = useRxData<Page>("pages", (collection) =>
        collection.findOne(id),
    );
    const page = result?.[0];
    return { page, isFetching };
};
