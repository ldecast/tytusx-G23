"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Enum_1 = require("../../../../model/xpath/Enum");
const Contexto_1 = require("../../../Contexto");
const Match_1 = __importDefault(require("./Match"));
function Relacional(_expresion, _ambito, _contexto, _id) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo, _contexto, _id);
    if (operators === null || operators.error)
        return operators;
    if (Array.isArray(operators))
        return operators;
    switch (operators.tipo) {
        case Enum_1.Tipos.RELACIONAL_MAYOR:
            return mayor(operators.op1, operators.op2, operators.exp);
        case Enum_1.Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(operators.op1, operators.op2, operators.exp);
        case Enum_1.Tipos.RELACIONAL_MENOR:
            return menor(operators.op1, operators.op2, operators.exp);
        case Enum_1.Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(operators.op1, operators.op2, operators.exp);
        case Enum_1.Tipos.RELACIONAL_IGUAL:
            return igual(operators.op1, operators.op2, operators.exp);
        case Enum_1.Tipos.RELACIONAL_DIFERENTE:
            return diferente(operators.op1, operators.op2, operators.exp);
        default:
            return null;
    }
}
function init(_opIzq, _opDer, _ambito, _tipo, _contexto, _id) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito, _contexto, _id);
    if (op1 === null || op1.error)
        return op1;
    let op2 = Expresion(_opDer, _ambito, _contexto, _id);
    if (op2 === null || op2.error)
        return op2;
    let tipo = _tipo;
    if (op1.cadena || op2.cadena) {
        if (op1.cadena && (op2.tipo === Enum_1.Tipos.NUMBER || op2.tipo === Enum_1.Tipos.STRING)) {
            if (_ambito.contextFromVar && _ambito.contextFromVar.contexto) {
                _contexto = _ambito.contextFromVar.contexto;
                _ambito.contextFromVar = null;
            }
            let tmp = new Contexto_1.Contexto(_contexto);
            return Match_1.default(op2.valor, tipo, op1, tmp);
        }
        else
            return null;
    }
    // Numéricas
    if (tipo === Enum_1.Tipos.RELACIONAL_MAYOR || tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL ||
        tipo === Enum_1.Tipos.RELACIONAL_MENOR || tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL) {
        if ((op1.tipo === Enum_1.Tipos.FUNCION_POSITION || op1.tipo === Enum_1.Tipos.FUNCION_LAST) && op2.tipo === Enum_1.Tipos.NUMBER) {
            op1 = _contexto.getLength();
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && (op2.tipo === Enum_1.Tipos.FUNCION_POSITION || op2.tipo === Enum_1.Tipos.FUNCION_LAST)) {
            op2 = Number(op1.valor);
            op1 = _contexto.getLength();
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYOR)
                tipo = Enum_1.Tipos.RELACIONAL_MENOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MAYORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MENORIGUAL;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENOR)
                tipo = Enum_1.Tipos.RELACIONAL_MAYOR;
            if (_tipo === Enum_1.Tipos.RELACIONAL_MENORIGUAL)
                tipo = Enum_1.Tipos.RELACIONAL_MAYORIGUAL;
        }
        else if (op1.tipo === Enum_1.Tipos.ATRIBUTOS || op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
            let opIzq = { valor: 0, tipo: op1.tipo };
            let opDer = { valor: 0, tipo: op2.tipo };
            opIzq.tipo = Enum_1.Tipos.ATRIBUTOS;
            opDer.tipo = (op1.tipo === Enum_1.Tipos.ATRIBUTOS) ? (op2.tipo) : (op1.tipo);
            if (op1.tipo === Enum_1.Tipos.ATRIBUTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                opIzq.valor = op1.valor;
                opDer.valor = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
                opIzq.valor = op2.valor;
                opDer.valor = op1.valor;
            }
            else
                return { error: "Desigualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
            return { op1: opIzq, op2: opDer, tipo: tipo };
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && op2.tipo === Enum_1.Tipos.NUMBER) {
            // op1 = Number(op1.valor);
            // op2 = Number(op2.valor);
            // console.log(op1, 8989888, op2)
            return { op1: op1, op2: op2, tipo: tipo, exp: Enum_1.Tipos.BOOLEANO };
        }
        else if (op1.tipo === Enum_1.Tipos.ELEMENTOS || op2.tipo === Enum_1.Tipos.ELEMENTOS) {
            if (op1.tipo === Enum_1.Tipos.ELEMENTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                let tmp = op1.valor;
                op1 = op2.valor;
                op2 = tmp;
            }
            else if (op1.tipo === Enum_1.Tipos.ELEMENTOS && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
            return { op1: { valor: op1, id: true }, op2: op2, tipo: tipo };
        }
        else
            return { error: "Solamente se pueden comparar desigualdades entre valores numéricos.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
        return { op1: op1, op2: op2, tipo: tipo };
    }
    // Numéricas o texto
    if (tipo === Enum_1.Tipos.RELACIONAL_IGUAL || tipo === Enum_1.Tipos.RELACIONAL_DIFERENTE) {
        let opIzq = { valor: 0, tipo: op1.tipo };
        let opDer = { valor: 0, tipo: op2.tipo };
        if ((op1.tipo === Enum_1.Tipos.FUNCION_POSITION || op1.tipo === Enum_1.Tipos.FUNCION_LAST) && op2.tipo === Enum_1.Tipos.NUMBER) {
            opIzq.valor = _contexto.getLength();
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Enum_1.Tipos.NUMBER && (op2.tipo === Enum_1.Tipos.FUNCION_POSITION || op2.tipo === Enum_1.Tipos.FUNCION_LAST)) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _contexto.getLength();
        }
        else if (op1.tipo === Enum_1.Tipos.ATRIBUTOS || op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
            opIzq.tipo = Enum_1.Tipos.ATRIBUTOS;
            opDer.tipo = (op1.tipo === Enum_1.Tipos.ATRIBUTOS) ? (op2.tipo) : (op1.tipo);
            if (op1.tipo === Enum_1.Tipos.ATRIBUTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                opIzq.valor = op1.valor;
                opDer.valor = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ATRIBUTOS) {
                opIzq.valor = op2.valor;
                opDer.valor = op1.valor;
            }
            else
                return { error: "Igualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
            return { op1: opIzq, op2: opDer, tipo: tipo };
        }
        else if (op1.tipo === Enum_1.Tipos.FUNCION_TEXT || op2.tipo === Enum_1.Tipos.FUNCION_TEXT) {
            opIzq.tipo = Enum_1.Tipos.FUNCION_TEXT;
            opDer.tipo = (op1.tipo === Enum_1.Tipos.FUNCION_TEXT) ? (op2.tipo) : (op1.tipo);
            if (op1.tipo === Enum_1.Tipos.FUNCION_TEXT && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                opIzq.valor = op1.valor;
                opDer.valor = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.FUNCION_TEXT) {
                opIzq.valor = op2.valor;
                opDer.valor = op1.valor;
            }
            else
                return { error: "Igualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
            return { op1: opIzq, op2: opDer, tipo: tipo };
        }
        else if (op1.tipo === Enum_1.Tipos.ELEMENTOS || op2.tipo === Enum_1.Tipos.ELEMENTOS) {
            if (op1.tipo === Enum_1.Tipos.ELEMENTOS && (op2.tipo === Enum_1.Tipos.STRING || op2.tipo === Enum_1.Tipos.NUMBER)) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
            else if ((op1.tipo === Enum_1.Tipos.STRING || op1.tipo === Enum_1.Tipos.NUMBER) && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                let tmp = op1.valor;
                op1 = op2.valor;
                op2 = tmp;
            }
            else if (op1.tipo === Enum_1.Tipos.ELEMENTOS && op2.tipo === Enum_1.Tipos.ELEMENTOS) {
                op1 = op1.valor;
                op2 = op2.valor;
            }
        }
        else {
            return { op1: op1, op2: op2, tipo: tipo, exp: Enum_1.Tipos.BOOLEANO };
            // return { error: "Igualdad no compatible.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna }
        }
        return { op1: op1, op2: op2, tipo: tipo };
    }
    return { error: "Relación no procesada.", tipo: "Semántico", origen: "Query", linea: _opIzq.linea, columna: _opIzq.columna };
}
function mayor(_opIzq, _opDer, _exp) {
    if (_exp === Enum_1.Tipos.BOOLEANO)
        return [{ valor: (_opIzq.valor > _opDer.valor), tipo: _exp }];
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MAYOR };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYOR, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYOR, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: (_opDer + 1),
        tipo: Enum_1.Tipos.RELACIONAL_MAYOR
    };
}
function mayorigual(_opIzq, _opDer, _exp) {
    if (_exp === Enum_1.Tipos.BOOLEANO)
        return [{ valor: (_opIzq.valor >= _opDer.valor), tipo: _exp }];
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MAYORIGUAL };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYORIGUAL, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MAYORIGUAL, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: _opDer,
        tipo: Enum_1.Tipos.RELACIONAL_MAYORIGUAL
    };
}
function menor(_opIzq, _opDer, _exp) {
    if (_exp === Enum_1.Tipos.BOOLEANO)
        return [{ valor: (_opIzq.valor < _opDer.valor), tipo: _exp }];
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MENOR };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENOR, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENOR, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: (_opDer - 1),
        tipo: Enum_1.Tipos.RELACIONAL_MENOR
    };
}
function menorigual(_opIzq, _opDer, _exp) {
    if (_exp === Enum_1.Tipos.BOOLEANO)
        return [{ valor: (_opIzq.valor <= _opDer.valor), tipo: _exp }];
    if (_opIzq.id)
        return { e1: _opIzq.valor, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_MENORIGUAL };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENORIGUAL, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { referencia: _opIzq.valor, condicion: _opDer.valor, desigualdad: Enum_1.Tipos.RELACIONAL_MENORIGUAL, tipo: Enum_1.Tipos.ELEMENTOS };
    return {
        valor: _opDer,
        tipo: Enum_1.Tipos.RELACIONAL_MENORIGUAL
    };
}
function igual(_opIzq, _opDer, _exp) {
    if (_exp === Enum_1.Tipos.BOOLEANO)
        return [{ valor: (_opIzq.valor == _opDer.valor), tipo: _exp }];
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_IGUAL };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION || _opDer.tipo === Enum_1.Tipos.FUNCION_POSITION)
        return { valor: ((_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)), tipo: Enum_1.Tipos.NUMBER };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_LAST || _opDer.tipo === Enum_1.Tipos.FUNCION_LAST)
        return { valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)), tipo: Enum_1.Tipos.NUMBER };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_TEXT)
        return { condicion: _opDer.valor, tipo: Enum_1.Tipos.FUNCION_TEXT };
    return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_IGUAL };
}
function diferente(_opIzq, _opDer, _exp) {
    if (_exp === Enum_1.Tipos.BOOLEANO)
        return [{ valor: (_opIzq.valor != _opDer.valor), tipo: _exp }];
    if (_opIzq.tipo === Enum_1.Tipos.ELEMENTOS)
        return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_DIFERENTE };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION || _opDer.tipo === Enum_1.Tipos.FUNCION_POSITION)
        return { valor: ((_opIzq.tipo === Enum_1.Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)), tipo: Enum_1.Tipos.EXCLUDE };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_LAST || _opDer.tipo === Enum_1.Tipos.FUNCION_LAST)
        return { valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)), tipo: Enum_1.Tipos.EXCLUDE };
    if (_opIzq.tipo === Enum_1.Tipos.ATRIBUTOS)
        return { atributo: _opIzq.valor, condicion: _opDer.valor, exclude: true, tipo: Enum_1.Tipos.ATRIBUTOS };
    if (_opIzq.tipo === Enum_1.Tipos.FUNCION_TEXT)
        return { condicion: _opDer.valor, exclude: true, tipo: Enum_1.Tipos.FUNCION_TEXT };
    return { e1: _opIzq, e2: _opDer, tipo: Enum_1.Tipos.ELEMENTOS, desigualdad: Enum_1.Tipos.RELACIONAL_DIFERENTE };
}
module.exports = Relacional;
