import type {FormRules} from "naive-ui";
import type {ArticlePartial} from "~/types/Article";

export function useArticleValidator(modelRef: Ref<ArticlePartial>) {
    const rules: FormRules = {
        title: [
            {required: true, message: "Title is required", trigger: ["blur", "change"]},
            {min: 3, message: " title must be at least 3 characters long", trigger: ["blur", "change"]},
            {max: 50, message: " title must be at most 50 characters long", trigger: ["blur", "change"]}
        ],
        topic: [
            {required: true, message: "Topic is required", trigger: ["blur", "change"]},
        ]
    };

    return {rules};
}
