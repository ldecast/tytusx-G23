import { Ambito } from "../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../model/xpath/Enum";
// import Aritmetica from "./Operators/Aritmetica";
import Relacional from "./Operators/Relacional";
import Logica from "./Operators/Logica";

function Expresion(_expresion: any, _ambito: Ambito, _contexto: any): any { // retorna un objeto con cadena, errores, y un retorno
    let tipo: Tipos = _expresion.tipo;
    if (tipo === Tipos.NODENAME) {
        // let expresion = _ambito.getSimboloFromRoot(_expresion.nodename, _contexto);
        return { valor: _expresion.nodename, tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_CURRENT) {
        return { valor: ".", tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_ATTRIBUTES) {
        let valor = { id: _expresion.expresion, tipo: "@" };
        return { valor: valor, tipo: Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.ASTERISCO) {
        return { valor: "*", tipo: Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.STRING || tipo === Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Tipos.OPERACION_SUMA || tipo === Tipos.OPERACION_RESTA || tipo === Tipos.OPERACION_MULTIPLICACION
        || tipo === Tipos.OPERACION_DIVISION || tipo === Tipos.OPERACION_MODULO || tipo === Tipos.OPERACION_NEGACION_UNARIA) {
        const Aritmetica = require("./Operators/Aritmetica");
        return Aritmetica(_expresion, _ambito);
    }
    else if (tipo === Tipos.RELACIONAL_MAYOR || tipo === Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Tipos.RELACIONAL_MENOR || tipo === Tipos.RELACIONAL_MENORIGUAL
        || tipo === Tipos.RELACIONAL_IGUAL || tipo === Tipos.RELACIONAL_DIFERENTE) {
        return Relacional(_expresion, _ambito);
    }
    else if (tipo === Tipos.LOGICA_AND || tipo === Tipos.LOGICA_OR) {
        return Logica(_expresion, _ambito);
    }
    else {
        console.log(_expresion, "SSSSSSSS")
        return { err: `Error: Expresión no procesada.\n`, linea: _expresion.linea, columna: _expresion.columna };
    }

}

export = Expresion;