import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'
import type {Command} from "#shared/types/Command";

export type CommandSequenceCommand = Tables<'command_sequence_command'>
export type CommandSequenceCommandInsert = TablesInsert<'command_sequence_command'>
export type CommandSequenceCommandUpdate = TablesUpdate<'command_sequence_command'>

export type CommandSequenceCommandWithRelations = CommandSequenceCommand & { command: Command}