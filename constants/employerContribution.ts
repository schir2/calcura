import type {SelectOption} from "~/components/form/Select.vue";

export const EmployerContributionOptions: Record<string, SelectOption> = {
    none: {label: 'None', value: 'none'},
    percentage_of_contribution: {label: 'Percentage of Contribution', value: 'percentage_of_contribution'},
    percentage_of_compensation: {label: 'Percentage of Compensation', value: 'percentage_of_compensation'},
    fixed: {label: 'Fixed', value: 'fixed'},
} as const;

export type EmployerContributionStrategy = keyof typeof EmployerContributionOptions;
