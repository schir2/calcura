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
