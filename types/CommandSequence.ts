import type {Command} from "~/types/Command";

export type CommandSequenceOrderingType = 'predefined' | 'custom'

export interface CommandSequence {
    id: number;
    name: string;
    plan: number;
    orderingType: CommandSequenceOrderingType;
    commands: Command[];
}