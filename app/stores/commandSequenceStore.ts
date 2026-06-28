import type {Database} from '#shared/types/database.types'
import type {
    CommandSequenceInsert,
    CommandSequenceUpdate,
    CommandSequenceWithRelations
} from '#shared/types/CommandSequence'

const QUERY = '*, command_sequence_commands:command_sequence_command(*, command(*))'

export const useCommandSequenceStore = defineStore('command_sequence', () => {
    const client = useSupabaseClient<Database>()
    const map = ref<Record<number, CommandSequenceWithRelations>>({})
    const loaded = ref(false)

    const list = computed(() => Object.values(map.value))

    function get(id: number): CommandSequenceWithRelations | undefined {
        return map.value[id]
    }

    function set(id: number, value: CommandSequenceWithRelations) {
        map.value[id] = value
    }

    function remove(id: number) {
        delete map.value[id]
    }

    function reset() {
        map.value = {}
    }

    function setAll(rows: CommandSequenceWithRelations[]) {
        reset()
        map.value = Object.fromEntries(rows.map(row => [row.id, row]))
    }

    async function fetch(id: number): Promise<CommandSequenceWithRelations> {
        const {data, error} = await client
            .from('command_sequence')
            .select(QUERY)
            .eq('id', id)
            .single()
        if (error) throw error
        const row = data as CommandSequenceWithRelations
        set(id, row)
        return row
    }

    async function fetchByPlan(planId: number): Promise<CommandSequenceWithRelations[]> {
        const {data, error} = await client
            .from('command_sequence')
            .select(QUERY)
            .eq('plan_id', planId)
        if (error) throw error
        const rows = data as CommandSequenceWithRelations[]
        setAll(rows)
        return rows
    }

    async function create(payload: CommandSequenceInsert): Promise<CommandSequenceWithRelations> {
        const {data, error} = await client
            .from('command_sequence')
            .insert(payload)
            .select(QUERY)
            .single()
        if (error) throw error
        const row = data as CommandSequenceWithRelations
        set(row.id, row)
        return row
    }

    async function patch(id: number, update: CommandSequenceUpdate): Promise<CommandSequenceWithRelations> {
        const {data, error} = await client
            .from('command_sequence')
            .update(update)
            .eq('id', id)
            .select(QUERY)
            .single()
        if (error) throw error
        const row = data as CommandSequenceWithRelations
        set(id, row)
        return row
    }

    async function purge(id: number): Promise<CommandSequenceWithRelations | undefined> {
        const row = get(id)
        const {error} = await client.from('command_sequence').delete().eq('id', id)
        if (error) throw error
        remove(id)
        return row
    }

    async function reorder(sequenceId: number, orderedIds: number[]): Promise<void> {
        await Promise.all(
            orderedIds.map((cscId, index) =>
                client
                    .from('command_sequence_command')
                    .update({order: index + 1})
                    .eq('id', cscId)
                    .then(({error}) => {
                        if (error) throw error
                    })
            )
        )
        const sequence = map.value[sequenceId]
        if (!sequence) return
        const orderMap = Object.fromEntries(orderedIds.map((id, i) => [id, i + 1]))
        sequence.command_sequence_commands = [...sequence.command_sequence_commands]
            .map(csc => ({...csc, order: orderMap[csc.id] ?? csc.order}))
            .sort((a, b) => a.order - b.order)
    }

    async function toggleCommand(cscId: number, sequenceId: number, newValue: boolean): Promise<void> {
        const sequence = map.value[sequenceId]
        const csc = sequence?.command_sequence_commands.find(c => c.id === cscId)
        if (!csc) return
        const {error} = await client
            .from('command_sequence_command')
            .update({is_active: newValue})
            .eq('id', cscId)
        if (error) throw error
        csc.is_active = newValue
    }

    return {
        list, map, loaded,
        get, set, remove, reset,
        fetch, fetchByPlan, create, patch, purge,
        reorder, toggleCommand,
    }
})
