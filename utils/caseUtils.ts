function toSnakeCaseKey(key: string): string {
    return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function toCamelCaseKey(key: string): string {
    return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export function toSnakeCase(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(toSnakeCase)
    return Object.keys(obj).reduce((acc, key) => {
        acc[toSnakeCaseKey(key)] = toSnakeCase(obj[key])
        return acc
    }, {} as any)
}

export function toCamelCase(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(toCamelCase)
    return Object.keys(obj).reduce((acc, key) => {
        acc[toCamelCaseKey(key)] = toCamelCase(obj[key])
        return acc
    }, {} as any)
}