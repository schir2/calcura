import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type CommandSequence = Tables<'command_sequence'>
export type CommandSequenceInsert = TablesInsert<'command_sequence'>
export type CommandSequenceUpdate = TablesUpdate<'command_sequence'>