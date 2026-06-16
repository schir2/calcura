import type {Command} from "~/types/Command";

export type CommandSequenceOrderingType = 'predefined' | 'custom'

export type CommandSequence = {
    id: number
    name: string
    plan: number
    ordering_type: CommandSequenceOrderingType
    commands: Command[]
}