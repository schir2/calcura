import mitt from "mitt";

export type EventPayload = {
    message: string;
    scope: string;
};

export type Events = {
    error: EventPayload;
    info: EventPayload;
    success: EventPayload;
    warning: EventPayload;
};

const eventBus = mitt<Events>();

export default eventBus;