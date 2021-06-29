import { Tipos } from "../../xpath/Enum";

export class Variable {

    id: string;
    tipo: Tipos;

    constructor(_id: string, _tipo: Tipos) {
        this.id = _id;
        this.tipo = _tipo;
    }

}