import type {ManagerMap} from "~/models/plan/PlanManager";

export interface Command<T> {
    commandId: number;
    order: number;
    name: string;
    label: string;
    managerName: keyof ManagerMap;
    managerId: number;
    action: "process";
    data: T;
}


export function compareAndSyncCommands<T extends keyof ManagerMap>(previousCommands: Command<ManagerMap[T]>[], newCommands: Command<ManagerMap[T]>[]): Command<ManagerMap[T]>[] {
    const commandMap = new Map<string, number>()
    previousCommands.forEach((command, index) => {
        commandMap.set(`${command.managerName}-${command.managerId}`, index)
    })

    for (const command of newCommands) {
        const key = `${command.managerName}-${command.managerId}`;
        if (commandMap.has(key)) {
            commandMap.delete(key);
        } else {
            previousCommands.push(command)
            return previousCommands
        }
    }
    const removeIndex = [...commandMap.values()][0];
    return previousCommands.filter((_, index) => index !== removeIndex)

}