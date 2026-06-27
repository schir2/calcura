import type {Database} from '#shared/types/database.types'
import type {ModelName} from '#shared/types/ModelName'

type Tables = Database['public']['Tables']

export type ModalAction = 'create' | 'edit' | 'delete'

type CreatePayload<M extends ModelName> =
    { plan_id: number } & Partial<Omit<Tables[M]['Insert'], 'plan_id'>>

type EditPayload = { id: number }

export type DeletePayload = {
    model: ModelName
    id: number
    label?: string
    warning?: string
}

export type ModalPayload<A extends ModalAction, M extends ModelName> =
    A extends 'create' ? CreatePayload<M> :
    A extends 'edit' ? EditPayload :
    A extends 'delete' ? DeletePayload :
    never