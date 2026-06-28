import type {FormRules} from "naive-ui";
import type {Ref} from "vue";
import type {UserProfile} from "#shared/types/UserProfile";

export function userProfileRules(modelRef: Ref<Partial<UserProfile>>) {
    const rules: FormRules = {
        first_name: {
            required: true,
            message: "First name is required.",
            trigger: ["input", "blur"]
        },
        last_name: {
            required: true,
            message: "Last name is required.",
            trigger: ["input", "blur"]
        }
    };

    return {rules};
}
