import {createBaseService} from '~/services/baseService';
import type {Ira} from "~/types/Ira";

export function useIraService() {
    return useApi<Ira>('iras')
}