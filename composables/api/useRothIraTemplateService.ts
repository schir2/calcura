import {createBaseService} from '~/services/baseService';
import type {RothIraTemplate} from "~/types/RothIra";

export function useRothIraTemplateService() {
    return useApi<RothIraTemplate>('roth-ira-templates')
}