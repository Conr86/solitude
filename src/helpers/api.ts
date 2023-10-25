import { PageWithChildren } from "@/helpers/CustomTreeDataProvider.ts";
import axios from "axios";
import { Page } from "prisma/prisma-client";

export const apiBaseUrl = "http://localhost:3001";

function fetchPages(): Promise<PageWithChildren[]> {
    return axios.get(`${apiBaseUrl}/page`).then((r) => r.data);
}

function fetchPageById(pageId: string): Promise<Page> {
    return axios
        .get(`${apiBaseUrl}/page/${pageId}`)
        .then((r) => r.data)
        .catch((error) => {
            // Prefer error message from server if available
            throw new Error(error.response.data?.message ?? error.message);
        });
}

export const pageListQuery = {
    queryKey: ["pages"],
    queryFn: fetchPages,
};

export const pageByIdQuery = (pageId: string) => ({
    queryKey: ["pages", pageId],
    queryFn: () => fetchPageById(pageId),
});
