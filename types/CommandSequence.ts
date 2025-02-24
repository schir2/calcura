import type {Command} from "~/types/Command";

export type CommandSequenceOrderingType =  'predefined' | 'custom'
import type {Plan} from '~/types/Plan'
export interface CommandSequence {
    name: string;
    plan: Plan
    orderingType: CommandSequenceOrderingType
    commands: Command[]
}