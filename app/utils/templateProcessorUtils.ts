export function processTemplate<
    TDefaults extends Partial<TModel>,
    TTemplate,
    TModel
>(
    defaults: TDefaults,
    template: Partial<TTemplate>,
    overrides: Partial<TDefaults> = {}
): TDefaults {
    return Object.fromEntries(
        Object.entries(defaults).map(([key, defaultValue]) => [
            key,
            overrides[key as keyof TDefaults] ??
            template[key as keyof TTemplate] ??
            defaultValue,
        ])
    ) as TDefaults;
}
