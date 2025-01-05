import eventBus, {type Events} from "~/services/eventBus";

export function useEventBus() {
    const events = ref([]);

    function listen(eventName: keyof Events, callback: (payload: any) => void) {
        eventBus.on(eventName, callback);

        onUnmounted(() => {
            eventBus.off(eventName, callback);
        });
    }

    function emit(eventName: keyof Events, payload: any) {
        eventBus.emit(eventName, payload);
    }

    return { listen, emit, events };
}
