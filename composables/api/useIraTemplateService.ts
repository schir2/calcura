import {createBaseService} from '~/services/baseService';
import type {IraTemplate} from "~/types/Ira";

export function useIraTemplateService() {
    return useApi<IraTemplate>('ira-templates')
}