import type {Pipeline} from "~/interfaces/Pipeline";
import type Debt from "~/models/Debt";

export default class DebtPipeline implements Pipeline {

    process(debt: Debt): Debt {
        ???
            Also this relies on getting the current dispoable income of th erow
    }
}