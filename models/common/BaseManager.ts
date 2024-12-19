import type Command from "~/models/common/Command";
import type PlanManager from "~/models/plan/PlanManager";

export default abstract class BaseManager<TConfig, TState> {
    protected states: TState[] = [];
    protected readonly config: TConfig;
    readonly orchestrator: PlanManager;

    constructor(orchestrator: PlanManager, config: TConfig) {
        this.orchestrator = orchestrator;
        this.config = config
        this.setUp()
        const initialState = this.createInitialState();
        this.states.push(initialState);
    }

    protected abstract createInitialState(): TState;

    setUp(): void {
    }

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
        const baseState = this.processImplementation();
        const currentState = {...this.getCurrentState(), processed: true};
        this.updateCurrentState(currentState);
    }

    protected abstract processImplementation(): void;

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

    abstract createNextState(previousState: TState): TState;

    abstract getCommands(): Command[];
}
