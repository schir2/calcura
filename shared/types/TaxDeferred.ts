import type {Income} from "#shared/types/Income";
import type {Tables, TablesInsert, TablesUpdate} from '#shared/types/database.types'

export type TaxDeferred = Tables<'tax_deferred'> & { income?: Income }
export type TaxDeferredTemplate = Tables<'tax_deferred_template'>

export type TaxDeferredInsert = TablesInsert<'tax_deferred'>
export type TaxDeferredUpdate = TablesUpdate<'tax_deferred'>