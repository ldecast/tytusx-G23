import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Variable } from "../../../../model/xml/Ambito/Variable";
import { Tipos } from "../../../../model/xpath/Enum";
import { Contexto } from "../../../Contexto";

function Aritmetica(_expresion: any, _ambito: Ambito, _contexto: Contexto, _id?: any) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo, _contexto, _id);
    if (operators === null || operators.error) return operators;
    switch (operators.tipo) {
        case Tipos.OPERACION_SUMA:
            return suma(operators.op1, operators.op2);
        case Tipos.OPERACION_RESTA:
            return resta(operators.op1, operators.op2);
        case Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(operators.op1, operators.op2);
        case Tipos.OPERACION_DIVISION:
            return division(operators.op1, operators.op2);
        case Tipos.OPERACION_MODULO:
            return modulo(operators.op1, operators.op2);
        case Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(operators.op1);
        default:
            return null;
    }
}

function init(_opIzq: any, _opDer: any, _ambito: Ambito, _tipo: Tipos, _contexto: Contexto, _id?: any) {
    const Expresion = require("../Expresion");
    // console.log(_ambito.tablaVariables, 88888)
    // let tmp = new Ambito(null, "tmp", _ambito.tablaFunciones, _ambito.tablaVariables);
    // let tmp_c = new Contexto(_contexto, _ambito.tablaVariables);
    // if (_tipo === Tipos.OPERACION_SUMA) {
    //     console.log(_ambito.tablaVariables, 777777777)
    //     console.log(_contexto.tablaValores, 9898989898)
    // }

    let a: Array<Variable> = [];
    a = a.concat(_ambito.tablaVariables);
    let tmp = new Contexto(_contexto, a);

    let op1 = Expresion(_opIzq, _ambito, _contexto, _id);
    if (op1 === null || op1.error) return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto, _id);
    if (op2 === null || op2.error) return op2;
    if (_tipo === Tipos.OPERACION_SUMA) {
        console.log(_ambito.tablaVariables, 777777777)
        console.log(_contexto.tablaValores, 9898989898)
        // console.log(_opIzq.parametros[0].opIzq, 4444444444444, _opDer.parametros[0].opIzq)
        console.log(op1, 4444444444444, op2)
    }

    let tipo: Tipos = _tipo;
    if (op1.tipo === Tipos.FUNCION_LAST && op2.tipo === Tipos.NUMBER) {
        op1 = _contexto.getLength();
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_LAST) {
        op1 = Number(op1.valor);
        op2 = _contexto.getLength();
    }
    else if (op1.tipo === Tipos.FUNCION_POSITION && op2.tipo === Tipos.NUMBER) {
        op1 = _contexto.getLength();
        op2 = Number(op2.valor);
    }
    else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_POSITION) {
        op1 = Number(op1.valor);
        op2 = _contexto.getLength();
    }
    else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
    }
    else if ((op1.tipo === Tipos.STRING || op2.tipo === Tipos.STRING) && tipo === Tipos.OPERACION_SUMA) {
        op1 = String(op1.valor);
        op2 = String(op2.valor);
    }
    else return { error: "Solamente se pueden operar aritméticamente valores numéricos.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna }
    return { op1: op1, op2: op2, tipo: tipo };
}

function suma(_opIzq: any, _opDer: any) {
    return {
        valor: (_opIzq + _opDer),
        tipo: (typeof (_opIzq) === "number" && typeof (_opDer) === "number") ? (Tipos.NUMBER) : (Tipos.STRING)
    }
}

function resta(_opIzq: number, _opDer: number) {
    // console.log(_opIzq, 22222, _opDer)
    return {
        valor: (_opIzq - _opDer),
        tipo: Tipos.NUMBER,
    }
}

function multiplicacion(_opIzq: number, _opDer: number) {
    return {
        valor: (_opIzq * _opDer),
        tipo: Tipos.NUMBER,
    }
}

function division(_opIzq: number, _opDer: number) {
    if (_opDer == 0) return { error: "No es permitida la división entre 0." };
    return {
        valor: (_opIzq / _opDer),
        tipo: Tipos.NUMBER,
    }
}

function modulo(_opIzq: number, _opDer: number) {
    if (_opDer == 0) return { error: "No es permitido módulo entre 0." };
    return {
        valor: (_opIzq % _opDer),
        tipo: Tipos.NUMBER,
    }
}

function negacionUnaria(_opIzq: number) {
    return {
        valor: (0 - _opIzq),
        tipo: Tipos.NUMBER,
    }
}

export =  Aritmetica;