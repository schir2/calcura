import { reactive, computed } from 'vue';

export function useEntityManager<T>(entity: T, emit: any, entityName: string) {
    const currentConfig = reactive<T>(entity);

    const isModified = computed(() =>
        JSON.stringify(currentConfig) !== JSON.stringify(entity)
    );

    function resetEntity() {
        Object.assign(currentConfig, { ...entity });
    }

    function deleteEntity() {
        assertDefined((entity as any).id, `${entityName}Id`);
        emit(`delete${capitalize(entityName)}`, (entity as any).id);
    }

    function updateEntity() {
        assertDefined((entity as any).id, `${entityName}Id`);
        emit(`update${capitalize(entityName)}`, currentConfig);
    }

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return { currentConfig, isModified, resetEntity, deleteEntity, updateEntity };
}
