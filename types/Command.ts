import type {Database} from "~/types/database.types";

export type Command = Database['public']['Tables']['command']['Row'];
export type CommandInsert = Database['public']['Tables']['command']['Insert'];
export type CommandUpdate = Database['public']['Tables']['command']['Update'];