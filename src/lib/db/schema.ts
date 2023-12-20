import { RxCollection, RxDatabase } from "rxdb";

export const pageSchema = {
    title: "page schema",
    description: "a single document",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 48,
        },
        title: { type: "string" },
        content: { type: "string" },
        createdAt: {
            type: "string",
            format: "date-time",
            final: true,
        },
        updatedAt: {
            type: "string",
            format: "date-time",
        },
        order: { type: "number" },
        parentId: { type: "string" },
    },
    required: ["id", "title"],
} as const;

export type Page = {
    id: string;
    title: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
    order?: number;
    parentId?: string;
};

export type Database = RxDatabase<{
    pages: RxCollection<Page>;
}>;
