import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type Hsa = Tables<'hsa'>
export type HsaTemplate = Tables<'hsa_template'>

export type HsaContributionStrategy = Tables<'hsa'>['contribution_strategy']

export type HsaInsert = TablesInsert<'hsa'>
export type HsaUpdate = TablesUpdate<'hsa'>