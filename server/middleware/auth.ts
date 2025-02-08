export default defineEventHandler(async (event) => {

    try {
        const user = await $fetch("http://localhost:8000/api/users/me/", {
            credentials: "include",
            headers: { cookie: getHeader(event, "cookie") ?? '' },
        });

        event.context.auth = user;
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        event.context.auth = null;
    }
});
