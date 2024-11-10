import type Row  from '~/models/Row';
export interface InvestmentPipeline {
    process(row: Row): Row;
}