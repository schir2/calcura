import type Command from "~/models/common/Command";
import type PlanState from "~/models/plan/PlanState";

export default abstract class ManagerBase<TConfig, TState> {
    protected states: TState[] = [];
    protected readonly config: TConfig;

    constructor(config: TConfig) {
        this.config = config
        const initialState = this.createInitialState();
        this.states.push(initialState);
    }

    protected abstract createInitialState(): TState;

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

    abstract process(planState: PlanState): PlanState

    advanceTimePeriod(): TState {
        const previousState = this.getCurrentState();
        if (!(previousState as any).processed) {
            throw new Error("The current state has not been processed.");
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

    protected abstract createNextState(previousState: TState): TState;

    abstract getCommands(): Command[];
}