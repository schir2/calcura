import type {Income} from "#shared/types/Income";
import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Ira = Tables<'ira'> & { income?: Income }
export type IraTemplate = Tables<'ira_template'>

export type IraContributionStrategy = Tables<'ira'>['contribution_strategy']

export type IraInsert = TablesInsert<'ira'>
export type IraUpdate = TablesUpdate<'ira'>