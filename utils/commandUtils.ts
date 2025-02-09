import type {PlanManagers} from "~/models/plan/PlanManager";
import type {Command} from "~/types/Command";

export function compareAndSyncCommands<T extends keyof PlanManagers>(previousCommands: Command<PlanManagers[T]>[], newCommands: Command<PlanManagers[T]>[]): Command<PlanManagers[T]>[] {
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