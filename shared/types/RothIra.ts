import type {Income} from "#shared/types/Income";
import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type RothIra = Tables<'roth_ira'> & { income?: Income }
export type RothIraTemplate = Tables<'roth_ira_template'>

export type RothIraInsert = TablesInsert<'roth_ira'>
export type RothIraUpdate = TablesUpdate<'roth_ira'>