import type {PlanManagers} from "~/models/plan/PlanManager";
import type {Command} from "~/types/Command";

export function compareAndSyncCommands<T extends keyof PlanManagers>(previousCommands: Command[], newCommands: Command[]): Command[] {
    const commandMap = new Map<string, number>()
    previousCommands.forEach((command, index) => {
        commandMap.set(`${command.modelName}-${command.modelId}`, index)
    })

    for (const command of newCommands) {
        const key = `${command.modelName}-${command.modelId}`;
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