import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type CommandSequenceCommand = Tables<'command_sequence_command'>
export type CommandSequenceCommandInsert = TablesInsert<'command_sequence'>
export type CommandSequenceCommandUpdate = TablesUpdate<'command_sequence'>

export type CommandSequenceCommandWithRelations = CommandSequenceCommand & { command: Command}