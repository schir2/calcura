import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'
import type {CommandSequenceCommandWithRelations} from "#shared/types/CommandSequenceCommand";

export type CommandSequence = Tables<'command_sequence'>
export type CommandSequenceInsert = TablesInsert<'command_sequence'>
export type CommandSequenceUpdate = TablesUpdate<'command_sequence'>

export type CommandSequenceWithRelations = CommandSequence & { command_sequence_commands: CommandSequenceCommandWithRelations[]}