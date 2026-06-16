// types/nuxt.d.ts
export type NuxtApp = {
    $api: <T>(url: string, options?: any) => Promise<T>;
}

// Extending the NuxtApp type
declare module "#app" {
    type NuxtApp = {
        $api: <T>(url: string, options?: any) => Promise<T>;
    }
}

export {};
