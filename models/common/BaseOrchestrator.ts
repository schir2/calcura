import type Command from "~/models/common/Command";
import type {PlanState} from "~/models/plan/PlanState";
import {ContributionType} from "~/models/common/index";
import {FundType} from "~/models/plan/PlanManager";
import ManagerBase from "~/models/common/BaseManager";

export default abstract class BaseOrchestrator<TConfig, TState> {
    protected states: TState[] = [];
    protected readonly config: TConfig;
    protected managers: Record<string, ManagerBase<any, any>[]>

    constructor(config: TConfig) {
        this.config = config
        this.managers =  this.createManagers()
        const initialState = this.createInitialState();
        this.states.push(initialState);
    }

    protected abstract createManagers(): Record<string, ManagerBase<any, any>[]>

    protected abstract createInitialState(): TState;

    protected abstract requestFunds(amount: number, fundType: FundType): number;

    protected abstract contribute(amount: number, contributionType: ContributionType): void;

    protected abstract withdraw(amount: number, fundType: FundType): void

    getInitialState(): TState {
        return this.getState(0)
    }

    getState(index: number): TState {
        if (this.states.length < index) {
            throw new Error(`The state at ${index} does not exist.`);
        }
        return this.states[index]
    }

    getCurrentState(): TState {
        if (this.states.length === 0) {
            throw new Error("No states available. Ensure an initial state is created.");
        }
        return this.states[this.states.length - 1];
    }

    protected updateCurrentState(newState: TState): void {
        if (this.states.length === 0) {
            throw new Error("No states available. Ensure an initial state is created.");
        }
        this.states[this.states.length - 1] = newState;
    }

    process(planState: PlanState): PlanState {
        const baseState = this.processImplementation(planState);
        const currentState = {...this.getCurrentState(), processed: true};
        this.updateCurrentState(currentState);
        return {
            ...planState,
        }
    }

    protected abstract processImplementation(planState: PlanState): PlanState;

    advanceTimePeriod(): TState {
        const previousState = this.getCurrentState();
        if (!(previousState as any).processed) {
            throw new Error(`The current state has not been processed. ${JSON.stringify(previousState)}`);
        }
        const newState = this.createNextState(previousState);
        this.states.push(newState);
        return newState;
    }

    public getConfig(): TConfig {
        return this.config
    }

    public getStates(): TState[] {
        return this.states;
    }

    getAllManagers(): ManagerBase<any, any>[] {
        const managerValues = Object.values(this.managers);
        const allManagers: ManagerBase<any, any>[] = [];

        managerValues.forEach((managerOrManagers) => {
            if (Array.isArray(managerOrManagers)) {
                allManagers.push(...managerOrManagers);
            } else {
                allManagers.push(managerOrManagers as ManagerBase<any, any>);
            }
        });

        return allManagers;
    }

    getCommands(): Command[] {
        const commands: Command[] = []
        this.getAllManagers().forEach(manager => commands.push(...manager.getCommands()))
        return commands;
    }

    protected abstract createNextState(previousState: TState): TState;
}