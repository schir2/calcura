import type {Database} from "#shared/types/database.types";

export type TableName = keyof Database['public']['Tables']