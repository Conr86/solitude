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
        created_at: {
            type: "string",
            format: "date-time",
            final: true,
        },
        updated_at: {
            type: "string",
            format: "date-time",
        },
        index: { type: "number" },
        parent_id: { type: "string" },
    },
    required: ["id", "title"],
} as const;

export type Settings = {
    SUPABASE_KEY: string | undefined;
    SUPABASE_URL: string | undefined;
};

export type Page = {
    id: string;
    title: string;
    content?: string;
    created_at: string;
    updated_at: string;
    index?: number;
    parent_id?: string;
};

export type Database = RxDatabase<{
    pages: RxCollection<Page>;
}>;
