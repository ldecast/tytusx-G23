import { Contexto } from "../../Contexto";
import { Ambito } from "../../../model/xml/Ambito/Ambito";
import Expresion from "../../xpath/Expresion/Expresion";
import { Variable } from "../../../model/xml/Ambito/Variable";
import LetClause from "../Let";

function Exec(_instr: any, _ambito: Ambito, _contexto: Contexto, _id?: any) { // Buscar la función, asignar los nuevos parámetros y ejecutarla.
    let name: string = _instr.name;
    let parametros: Array<any> = _instr.parametros;
    let funcion = _ambito.getFunction(name);

    if (parametros.length !== funcion?.parametros.length)
        return { error: 'El número de parámetros debe coincidir con la cantidad de parámetros de la función', linea: _instr.linea, columna: _instr.columna, origen: "XQuery", tipo: "Semántico" };

    // Declaración de parámetros
    // let tmp = new Contexto(_contexto, _contexto.tablaValores);
    let a: Array<Variable> = [];
    a = a.concat(_contexto.tablaValores);
    let tmp = new Contexto(_contexto, a);
    for (let i = 0; i < parametros.length; i++) {
        const parametro = parametros[i];
        // const val = Expresion(parametros[i], _ambito, tmp, _id)
        const val = LetClause({ variable: funcion.parametros[i].id }, parametros[i], _ambito, tmp, _id);
        // console.log(val, 87878)
        console.log(_contexto.tablaValores, 555555555555555)
        // if (parametro) {
        //     let newVar = new Variable(funcion.parametros[i].id, funcion.parametros[i].tipado, parametro.linea, parametro.columna);
        //     newVar.setValue(val);
        //     // _ambito.addVariable(newVar);
        //     // console.log(newVar,4444444444)
        //     tmp.addVariable(newVar);
        // }
        // else console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
    }
    // Ejecutar código
    const Bloque_XQuery = require("../Bloque_XQuery");
    let _bloque = Bloque_XQuery.getIterators(funcion.sentencias, _ambito, tmp, _id);
    // console.log(_bloque, 339393939);
    if (_bloque.parametros) return _bloque.parametros[0];
    return _bloque;

}

export = Exec;