// types/nuxt.d.ts
export interface NuxtApp {
    $api: <T>(url: string, options?: any) => Promise<T>;
}

// Extending the NuxtApp type
declare module "#app" {
    interface NuxtApp {
        $api: <T>(url: string, options?: any) => Promise<T>;
    }
}

export {};
