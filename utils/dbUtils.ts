import Dexie from 'dexie';
import type { EntityTable } from 'dexie';

export function createEntityTable<T extends { id?: string | number }>(
    db: Dexie,
    tableName: string
): EntityTable<T, 'id'> {
    return db.table(tableName) as EntityTable<T, 'id'>;
}
