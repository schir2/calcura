import eventBus from "./eventBus";

eventBus.on("*", (eventName, payload) => {
    // console.log(`[Event Bus]: ${eventName}`, payload);
});
