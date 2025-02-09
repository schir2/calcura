export function useApi<T>(resource: string) {
    const csrfToken = useCookie("csrftoken"); // Automatically sent by the browser

    const useCustomFetch = <R>(url: string, options: any = {}) => {
        options.credentials = 'include'; // Ensure cookies are sent

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method)) {
            options.headers = {
                ...(options.headers || {}),
                'X-CSRFToken': csrfToken.value || ''
            };
        }

        return $fetch<T>(`/api/${url}`, options);
    };

    return {
        get: (id: number | string, params?: Record<string, any>) => useCustomFetch<T>(`${resource}/${id}/`, { params }),
        list: (params?: Record<string, any>) => useCustomFetch<T[]>(`${resource}/`, { params }),
        create: (data: Partial<T>) => useCustomFetch<T>(`${resource}/`, { method: 'POST', body: toSnakeCase(data) }),
        update: (id: number | string, data: Partial<T>) => useCustomFetch<T>(`${resource}/${id}/`, { method: 'PUT', body: toSnakeCase(data) }),
        patch: (id: number | string, data: Partial<T>) => useCustomFetch<T>(`${resource}/${id}/`, { method: 'PATCH', body: toSnakeCase(data) }),
        remove: (id: number | string) => useCustomFetch(`${resource}/${id}/`, { method: 'DELETE' }),

        addRelatedModel: (id: number, relatedModel: string, relatedId: number | string) =>
            useCustomFetch(`${resource}/${id}/manage_related_model/`, { method: 'POST', body: { related_model: relatedModel, related_id: relatedId, action: 'add' } }),

        removeRelatedModel: (id: number | string, relatedModel: string, relatedId: number | string) =>
            useCustomFetch(`${resource}/${id}/manage_related_model/`, { method: 'POST', body: { related_model: relatedModel, related_id: relatedId, action: 'remove' } }),
    };
}
