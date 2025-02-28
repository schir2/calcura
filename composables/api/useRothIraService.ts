import {createBaseService} from '~/services/baseService';
import type {RothIra} from "~/types/RothIra";

export function useRothIraService() {
    return useApi<RothIra>('roth-iras')
}