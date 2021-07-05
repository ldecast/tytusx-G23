"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XQObjeto = void 0;
const Enum_1 = require("../xpath/Enum");
class XQObjeto {
    nuevoFor(_cuerpoDec, _instrucciones, _linea, _columna) {
        return {
            cuerpo: _cuerpoDec,
            instrucciones: _instrucciones,
            tipo: Enum_1.Tipos.FOR_LOOP,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaVariable(_variable, _linea, _columna) {
        return {
            variable: _variable,
            tipo: Enum_1.Tipos.VARIABLE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaExpresion(_variable, _valor, _linea, _columna) {
        return {
            variable: _variable,
            valor: _valor,
            tipo: Enum_1.Tipos.ASIGNACION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoLet(_varName, _valor, _linea, _columna) {
        return {
            id: _varName,
            valor: _valor,
            tipo: Enum_1.Tipos.LET_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoWhere(_condiciones, _linea, _columna) {
        return {
            condiciones: _condiciones,
            tipo: Enum_1.Tipos.WHERE_CONDITION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoOrderBy(_orders, _linea, _columna) {
        return {
            ordenes: _orders,
            tipo: Enum_1.Tipos.ORDER_BY_CLAUSE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoReturn(_expresion, _linea, _columna) {
        return {
            expresion: _expresion,
            tipo: Enum_1.Tipos.RETURN_STATEMENT,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoValor(_valor, _tipo, _linea, _columna) {
        return {
            valor: _valor,
            tipo: _tipo,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaDeclaracion(_variables, _at, _iterators, _linea, _columna) {
        return {
            variable: _variables,
            atKey: _at,
            iterators: _iterators,
            tipo: Enum_1.Tipos.DECLARACION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoIntervalo(_valor1, _valor2, _linea, _columna) {
        return {
            valor1: _valor1,
            valor2: _valor2,
            tipo: Enum_1.Tipos.INTERVALO,
            linea: _linea,
            columna: _columna
        };
    }
    nuevosValores(_valores, _linea, _columna) {
        return {
            valores: _valores,
            tipo: Enum_1.Tipos.VALORES,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoContenido(_valor, _linea, _columna) {
        return {
            contenido: _valor,
            tipo: Enum_1.Tipos.CONTENIDO,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaInyeccion(_path, _linea, _columna) {
        return {
            valor: _path,
            tipo: Enum_1.Tipos.INYECCION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoHTML(_id_open, _atributos, _contenido, _id_close, _linea, _columna) {
        return {
            id_open: _id_open,
            id_close: _id_close,
            atributos: _atributos,
            value: _contenido,
            tipo: Enum_1.Tipos.HTML,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoIf_Then_Else(_condicionIf, _instruccionesThen, _instruccionesElse, _linea, _columna) {
        return {
            condicionIf: _condicionIf,
            instruccionesThen: _instruccionesThen,
            instruccionesElse: _instruccionesElse,
            tipo: Enum_1.Tipos.IF_THEN_ELSE,
            linea: _linea,
            columna: _columna
        };
    }
    nuevoParametro(_id, _tipado, _linea, _columna) {
        return {
            id: _id,
            tipado: _tipado,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaFuncion(_name, _parametros, _tipado, _instrucciones, _linea, _columna) {
        return {
            name: _name,
            parametros: _parametros,
            tipado: _tipado,
            instrucciones: _instrucciones,
            tipo: Enum_1.Tipos.DECLARACION_FUNCION,
            linea: _linea,
            columna: _columna
        };
    }
    nuevaLlamada(_name, _parametros, _linea, _columna) {
        return {
            name: _name,
            parametros: _parametros,
            tipo: Enum_1.Tipos.LLAMADA_FUNCION,
            linea: _linea,
            columna: _columna
        };
    }
    llamadaNativa(_name, _parametros, _linea, _columna) {
        return {
            name: _name,
            parametros: _parametros,
            tipo: Enum_1.Tipos.LLAMADA_NATIVA,
            linea: _linea,
            columna: _columna
        };
    }
}
exports.XQObjeto = XQObjeto;
