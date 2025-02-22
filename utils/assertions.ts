export function assertDefined<T>(value: T | undefined, name: string): asserts value is T {
    if (value === undefined || value === null) {
        throw new Error(`${name} is undefined`);
    }
}
