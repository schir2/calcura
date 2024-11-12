import {taxableSavingsPipeline} from "./taxableSavingsPipeline";
import {taxDeferredEmployerPipeline} from "./taxDeferredEmployerPipeline";
import {taxDeferredPipeline} from "./taxDeferredPipeline"
import {iraTaxableSavingsPipeline} from "./iraTaxableSavingsPipeline";
import endOfYearPipeline from "./endOfYearPipeline";
import {iraTaxDeferredSavingsPipeline} from "./iraTaxDeferredSavingsPipeline";
import {debtPipelineByName} from "~/models/pipelines/debtPipelineByName";


export const pipeline = {
    taxDeferredEmployerMatchPipeline: taxDeferredEmployerPipeline,
    taxableSavingsPipeline: taxableSavingsPipeline,
    taxDeferredPipeline: taxDeferredPipeline,
    iraTaxableSavingsPipeline: iraTaxableSavingsPipeline,
    iraTaxDeferredSavingsPipeline: iraTaxDeferredSavingsPipeline,
    endOfYearPipeline: endOfYearPipeline,
    debtPipelineByName: debtPipelineByName
};

export const defaultPipelineConfig  = [
    {name: "taxDeferredEmployerPipeline", pipeline: taxDeferredEmployerPipeline, priority: 1},
    {name: "taxableSavingsPipeline", pipeline: taxableSavingsPipeline, priority: 2},
    {name: "taxDeferredPipeline", pipeline: taxDeferredPipeline, priority: 3},
    {name: "iraTaxableSavingsPipeline", pipeline: iraTaxableSavingsPipeline, priority: 4},
    {name: "iraTaxDeferredSavingsPipeline", pipeline: iraTaxDeferredSavingsPipeline, priority: 5},
    {name: "debtPipelineByName", pipeline: debtPipelineByName, priority: 6},
    {name: "endOfYearPipeline", pipeline: endOfYearPipeline, priority: 7},
]