import type Command from "~/models/common/Command";
import {ContributionType} from "~/models/common/index";
import {FundType} from "~/models/plan/PlanManager";
import BaseManager from "~/models/common/BaseManager";
import {ProcessError} from "~/utils/errors/ProcessError";
import type {BaseState} from "~/models/common/BaseState";


export abstract class BaseOrchestrator<TConfig, TState extends BaseState, TManagers> {
    protected states: TState[] = [];
    protected readonly config: TConfig;
    protected _managers: TManagers

    constructor(config: TConfig) {
        this.config = config
        this._managers = this.createManagers()
        const initialState = this.createInitialState();
        this.states.push(initialState);
    }

    get managers(): TManagers {
        return this._managers;
    }

    protected abstract createManagers(): TManagers

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

    process(): void {
        const currentState = this.getCurrentState();
        if (currentState.processed === undefined && null) {
            throw new ProcessError('State is missing processed property')
        }
        if (currentState.processed) {
            throw new ProcessError(`Failed to process state, it is already processed.`);
        }
        this.processImplementation();
        this.updateCurrentState({...this.getCurrentState(), processed: true});
    }

    protected abstract processImplementation(): void;

    advanceTimePeriod(): TState {
        const previousState = this.getCurrentState();
        if (!(previousState as any).processed) {
            throw new Error(`The current state has not been processed. ${JSON.stringify(previousState)}`);
        }
        const newState = this.createNextState(previousState);
        console.log(newState)
        this.states.push(newState);
        return newState;
    }

    public getConfig(): TConfig {
        return this.config
    }

    public getStates(): TState[] {
        return this.states;
    }

    getAllManagers(): BaseManager<any, any>[] {
        const managerValues = Object.values(this.managers);
        const allManagers: BaseManager<any, any>[] = [];

        managerValues.forEach((managerOrManagers) => {
            if (Array.isArray(managerOrManagers)) {
                allManagers.push(...managerOrManagers);
            } else {
                allManagers.push(managerOrManagers as BaseManager<any, any>);
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
