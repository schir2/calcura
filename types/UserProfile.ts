import type {TablesInsert, TablesUpdate} from '~/types/database.types'

export type UserProfile = {
    id: number;
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    birthday: string | null;
    life_expectancy: number | null;
    is_admin: boolean;
    created_at: string;
    edited_at: string;
}

export type UserProfileInsert = TablesInsert<'profiles'>
export type UserProfileUpdate = TablesUpdate<'profiles'>
