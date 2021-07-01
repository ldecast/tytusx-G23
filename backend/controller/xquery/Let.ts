import { Ambito } from "../../model/xml/Ambito/Ambito";
import { Contexto } from "../Contexto";
import { Tipos } from "../../model/xpath/Enum";
import { Variable } from "../../model/xml/Ambito/Variable";

function LetClause(_id: any, _valor: any, _ambito: Ambito, _contexto: Contexto, id?: any) {
    const Bloque_XQuery = require("./Bloque_XQuery");
    let tmp = new Contexto(_contexto);
    let variable = new Variable(_id.variable, Tipos.VARIABLE);
    let contexto: Contexto = Bloque_XQuery.getIterators(_valor, _ambito, tmp, id);
    if (contexto) {
        variable.contexto = new Contexto(contexto);
        _ambito.addVariabe(variable);
    }
    // console.log(variable, 33232323);
}

export = LetClause;