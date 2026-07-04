export type ToolAvailability = 'available' | 'coming-soon'

export interface Tool {
    id: string
    label: string
    description: string
    icon: string
    route?: string
    availability: ToolAvailability
}

export const tools: Tool[] = [
    {
        id: 'planner',
        label: 'Planner',
        description: 'Build and simulate your retirement plans.',
        icon: 'mdi:flower-poppy',
        route: '/plans',
        availability: 'available',
    },
    {
        id: 'debt-visualizer',
        label: 'Debt Visualizer',
        description: 'See how debt grows over time and how payoff strategies compare.',
        icon: 'mdi:trending-down',
        availability: 'coming-soon',
    },
    {
        id: 'investment-visualizer',
        label: 'Investment Visualizer',
        description: 'Compare a plain bank account against investment types and their tax strategies.',
        icon: 'mdi:chart-line',
        availability: 'coming-soon',
    },
    {
        id: 'compound-interest',
        label: 'Compound Interest',
        description: 'Visualize how compound interest works for both saving and borrowing.',
        icon: 'mdi:finance',
        availability: 'coming-soon',
    },
    {
        id: 'learn',
        label: 'Learn',
        description: 'Articles and references on how it all works.',
        icon: 'mdi:book-open-variant',
        availability: 'coming-soon',
    },
]

export function isAvailable(tool: Tool): boolean {
    return tool.availability === 'available'
}