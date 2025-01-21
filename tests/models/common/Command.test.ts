import {describe, expect, it} from "vitest";
import {compareAndSyncCommands} from '~/models/common/Command'
import type Command from "~/models/common/Command";

describe("compareAndSyncCommands", () => {
    it("should add a new command to the list", () => {
        const prevCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];
        const newCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"},
            {name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"}
        ];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual({name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"});
    });

    it("should remove a command from the list", () => {
        const prevCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"},
            {name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"}
        ];
        const newCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toHaveLength(1);
        expect(result).not.toContainEqual({name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"});
    });

    it("should return the same list if no changes are made", () => {
        const prevCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];
        const newCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toEqual(prevCommands);
    });

    it("should not allow more than one change at a time (adding and removing)", () => {
        const prevCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];
        const newCommands: Command[] = [
            {name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"}
        ];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toHaveLength(2); // Because we are only adding in this pass
    });

    it("should handle an empty previousCommands array and add the new command", () => {
        const prevCommands: Command[] = [];
        const newCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"});
    });

    it("should handle an empty newCommands array and remove the old command", () => {
        const prevCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"}
        ];
        const newCommands: Command[] = [];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toHaveLength(0);
    });

    it("should only remove the correct command", () => {
        const prevCommands: Command[] = [
            {name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"},
            {name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"}
        ];
        const newCommands: Command[] = [
            {name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"}
        ];

        const result = compareAndSyncCommands(prevCommands, newCommands);
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({name: "cmd2", label: "Command 2", managerName: "debtManagers", managerId: "2", action: "process"});
        expect(result).not.toContainEqual({name: "cmd1", label: "Command 1", managerName: "incomeManagers", managerId: "1", action: "process"});
    });
});