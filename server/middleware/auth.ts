export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event);
    const csrfToken = cookies['csrftoken'];
    const sessionId = cookies['sessionid'];

    if (csrfToken) {
        setHeader(event, 'X-CSRFToken', csrfToken);
    }
    if (sessionId) {
        setHeader(event, 'Cookie', `sessionid=${sessionId}`);
    }
});
