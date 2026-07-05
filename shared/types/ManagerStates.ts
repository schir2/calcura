import type {ModelName} from "#shared/types/ModelName";
import type {BaseState} from "#shared/types/BaseState";

export type ManagerStates = Partial<Record<ModelName, Record<number, BaseState[]>>>