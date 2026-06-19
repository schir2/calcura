import type {Tables, TablesInsert, TablesUpdate} from "~/types/database.types";

export type Command = Tables<'command'>
export type CommandInsert = TablesInsert<'command'>
export type CommandUpdate = TablesUpdate<'command'>