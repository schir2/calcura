import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type UserProfile = Tables<'profiles'>

export type UserProfileInsert = TablesInsert<'profiles'>
export type UserProfileUpdate = TablesUpdate<'profiles'>
