import { Contexto } from "../../../controller/Contexto";
import { Tipos } from "../../xpath/Enum";

export class Variable {

    id: string;
    tipo: Tipos;
    contexto?: Contexto;
    valor?: any;

    constructor(_id: string, _tipo: Tipos) {
        this.id = _id;
        this.tipo = _tipo;
    }

    setValue(_obj: any) {
        if (_obj.constructor.name === "Contexto") {
            this.contexto = _obj;
        }
        else {
            this.valor = _obj;
        }
    }

}