import type Row from "~/models/Row";

export interface Process {

    process(row: Row): Row;

}