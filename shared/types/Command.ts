import type {Tables, TablesInsert, TablesUpdate} from "#shared/types/database.types";

export type Command = Tables<'command'>
export type CommandInsert = TablesInsert<'command'>
export type CommandUpdate = TablesUpdate<'command'>