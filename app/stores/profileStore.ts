export const useProfileStore = defineStore('profile', () => {
    const profile = ref<null | Awaited<ReturnType<ReturnType<typeof useProfileService>['get']>>>(null)

    const user = useSupabaseUser()

    watch(user, async (newUser) => {
        if (newUser?.id) {
            const {get} = useProfileService()
            profile.value = await get(newUser.id)
        } else {
            profile.value = null
        }
    }, {immediate: true})

    return {profile}
})