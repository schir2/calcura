export function useTitle() {
    const route = useRoute();

    function getTitle(): string {
        return route.meta.title as string ?? 'Calcura';
    }

    const title = computed(()=>{
        return getTitle();
    })

    return {title}
}