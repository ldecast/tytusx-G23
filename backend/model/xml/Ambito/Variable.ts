import { Contexto } from "../../../controller/Contexto";
import { Tipos } from "../../xpath/Enum";

export class Variable {

    id: string;
    tipo: Tipos;
    contexto?: Contexto;

    constructor(_id: string, _tipo: Tipos) {
        this.id = _id;
        this.tipo = _tipo;
    }

}