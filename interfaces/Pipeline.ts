import type Row from "~/models/Row";

export interface Pipeline {

    process(row: Row): Row;

}