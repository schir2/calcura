export function useApi<T>(resource: string) {
    const csrfToken = useCookie("csrftoken");


    const useCustomFetch = async <R>(url: string, options: any = {}): Promise<R> => {
        options.credentials = "include";

        if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method)) {
            options.headers = {
                ...(options.headers || {}),
                "X-CSRFToken": csrfToken.value || "",
            };
        }

        return await $fetch<R>(`/api/${url}`, options);
    };

    return {
        get: (id: number | string, params?: Record<string, any>) => useCustomFetch<T>(`${resource}/${id}/`, { params }),
        list: (params?: Record<string, any>) => useCustomFetch<T[]>(`${resource}/`, { params }),
        create: (data: Partial<T>) => useCustomFetch<T>(`${resource}/`, { method: "POST", body: data }),
        update: (id: number | string, data: Partial<T>) => useCustomFetch<T>(`${resource}/${id}/`, { method: "PUT", body: data }),
        patch: (id: number | string, data: Partial<T>) => useCustomFetch<T>(`${resource}/${id}/`, { method: "PATCH", body: data }),
        remove: (id: number | string) => useCustomFetch<void>(`${resource}/${id}/`, { method: "DELETE" }),

        addRelatedModel: (id: number, relatedModel: string, relatedId: number | string) =>
            useCustomFetch<T>(`${resource}/${id}/manage_related_model/`, {
                method: "POST",
                body: { related_model: relatedModel, related_id: relatedId, action: "add" },
            }),

        removeRelatedModel: (id: number | string, relatedModel: string, relatedId: number | string) =>
            useCustomFetch<T>(`${resource}/${id}/manage_related_model/`, {
                method: "POST",
                body: { related_model: relatedModel, related_id: relatedId, action: "remove" },
            }),
    };
}