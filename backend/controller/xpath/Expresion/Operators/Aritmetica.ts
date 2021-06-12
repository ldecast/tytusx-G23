import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";

function Aritmetica(_expresion: any, _ambito: Ambito) {
    switch (_expresion.tipo) {
        case Tipos.OPERACION_SUMA:
            return suma(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.OPERACION_RESTA:
            return resta(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.OPERACION_MULTIPLICACION:
            return multiplicacion(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.OPERACION_DIVISION:
            return division(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.OPERACION_MODULO:
            return modulo(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.OPERACION_NEGACION_UNARIA:
            return negacionUnaria(_expresion.opIzq, _ambito);
        default:
            break;
    }
}

function suma(_opIzq: any, _opDer: any, _ambito: Ambito) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo;
    if (op1.tipo === Tipos.STRING || op2.tipo === Tipos.STRING) {
        op1 = String(op1.valor);
        op2 = String(op2.valor);
        tipo = Tipos.STRING;
    }
    else if (_opIzq.tipo === Tipos.NUMBER && _opDer.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden sumar valores numéricos o concatenar cadenas.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        }
    }
    let resultado = op1 + op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    }
}

function resta(_opIzq: any, _opDer: any, _ambito: Ambito) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo;
    if (_opIzq.tipo === Tipos.NUMBER && _opDer.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden restar valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        }
    }
    let resultado = op1 - op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    }
}

function multiplicacion(_opIzq: any, _opDer: any, _ambito: Ambito) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo;
    if (_opIzq.tipo === Tipos.NUMBER && _opDer.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden multiplicar valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        }
    }
    let resultado = op1 * op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    }
}

function division(_opIzq: any, _opDer: any, _ambito: Ambito) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo;
    if (_opIzq.tipo === Tipos.NUMBER && _opDer.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se pueden dividir valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        }
    }
    let resultado = op1 / op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    }
}

function modulo(_opIzq: any, _opDer: any, _ambito: Ambito) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo;
    if (_opIzq.tipo === Tipos.NUMBER && _opDer.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        op2 = Number(op2.valor);
        tipo = Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se puede realizar módulo con valores numéricos.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        }
    }
    let resultado = op1 % op2;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    }
}

function negacionUnaria(_opIzq: any, _ambito: Ambito) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let tipo;
    if (_opIzq.tipo === Tipos.NUMBER) {
        op1 = Number(op1.valor);
        tipo = Tipos.NUMBER;
    }
    else {
        return {
            err: "Solamente se puede negar un valor numérico.\n",
            linea: _opIzq.linea,
            columna: _opIzq.columna
        }
    }
    let resultado = 0 - op1;
    return {
        valor: resultado,
        tipo: tipo,
        linea: _opIzq.linea,
        columna: _opIzq.columna,
    }
}

export =  Aritmetica;