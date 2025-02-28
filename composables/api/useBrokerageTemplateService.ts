import {createBaseService} from '~/services/baseService';
import type {BrokerageTemplate} from "~/types/Brokerage";

export function useBrokerageTemplateService() {
    return useApi<BrokerageTemplate>('brokerage-templates')
}