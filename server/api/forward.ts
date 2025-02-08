export default defineEventHandler((event) => {
    return event.$fetch('/api/forwarded')
})
