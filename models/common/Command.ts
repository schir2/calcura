import type {ManagerMap} from "~/models/plan/PlanManager";

export default interface Command {
    name: string;
    label: string;
    managerName: keyof ManagerMap;
    managerId: string;
    action: 'process'
}


export function compareAndSyncCommands(previousCommands: Command[], newCommands: Command[]): Command[] {
    const commandMap = new Map<string, number>()
    previousCommands.forEach((command, index) => {
        commandMap.set(`${command.managerName}-${command.managerId}`, index)
    })

    for (const command of newCommands) {
        const key = `${command.managerName}-${command.managerId}`;
        if (commandMap.has(key)) {
            commandMap.delete(key);
        }
        else {
            previousCommands.push(command)
            return previousCommands
        }
    }
    const removeIndex = [...commandMap.values()][0];
    return previousCommands.filter((_, index) => index !== removeIndex)

}