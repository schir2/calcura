import type {Database} from "#shared/types/database.types";

export type Tables = Database['public']['Tables']

export type TableName = keyof Tables