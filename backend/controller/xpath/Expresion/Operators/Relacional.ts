import { Tipos } from "../../../../model/xpath/Enum";

function Relacional(_expresion: any, _ambito: Array<any>) {
    let operators = init(_expresion.opIzq, _expresion.opDer, _ambito, _expresion.tipo);
    if (operators.err) return operators;
    switch (operators.tipo) {
        case Tipos.RELACIONAL_MAYOR:
            return mayor(operators.op1, operators.op2);
        case Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(operators.op1, operators.op2);
        case Tipos.RELACIONAL_MENOR:
            return menor(operators.op1, operators.op2);
        case Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(operators.op1, operators.op2);
        case Tipos.RELACIONAL_IGUAL:
            return igual(operators.op1, operators.op2);
        case Tipos.RELACIONAL_DIFERENTE:
            return diferente(operators.op1, operators.op2);
        default:
            return null;
    }
}

function init(_opIzq: any, _opDer: any, _ambito: Array<any>, _tipo: Tipos) {
    const Expresion = require("../Expresion");
    let op1 = Expresion(_opIzq, _ambito);
    let op2 = Expresion(_opDer, _ambito);
    let tipo: Tipos = _tipo;
    if (tipo === Tipos.RELACIONAL_MAYOR || tipo === Tipos.RELACIONAL_MAYORIGUAL ||
        tipo === Tipos.RELACIONAL_MENOR || tipo === Tipos.RELACIONAL_MENORIGUAL) {
        if (op1.tipo === Tipos.FUNCION_LAST && op2.tipo === Tipos.NUMBER) {
            op1 = _ambito.length;
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_LAST) {
            op2 = Number(op1.valor);
            op1 = _ambito.length;
            if (_tipo === Tipos.RELACIONAL_MAYOR) tipo = Tipos.RELACIONAL_MENOR;
            if (_tipo === Tipos.RELACIONAL_MAYORIGUAL) tipo = Tipos.RELACIONAL_MENORIGUAL;
            if (_tipo === Tipos.RELACIONAL_MENOR) tipo = Tipos.RELACIONAL_MAYOR;
            if (_tipo === Tipos.RELACIONAL_MENORIGUAL) tipo = Tipos.RELACIONAL_MAYORIGUAL;
        }
        else if (op1.tipo === Tipos.FUNCION_POSITION && op2.tipo === Tipos.NUMBER) {
            op1 = _ambito.length;
            op2 = Number(op2.valor);
        }
        else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_POSITION) {
            op2 = Number(op1.valor);
            op1 = _ambito.length;
            if (_tipo === Tipos.RELACIONAL_MAYOR) tipo = Tipos.RELACIONAL_MENOR;
            if (_tipo === Tipos.RELACIONAL_MAYORIGUAL) tipo = Tipos.RELACIONAL_MENORIGUAL;
            if (_tipo === Tipos.RELACIONAL_MENOR) tipo = Tipos.RELACIONAL_MAYOR;
            if (_tipo === Tipos.RELACIONAL_MENORIGUAL) tipo = Tipos.RELACIONAL_MAYORIGUAL;
        }
        else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.NUMBER) {
            op1 = Number(op1.valor);
            op2 = Number(op2.valor);
        }
        else return { err: "Solamente se pueden comparar desigualdades entre valores numéricos.\n", linea: _opIzq.linea, columna: _opIzq.columna }
    }
    if (tipo === Tipos.RELACIONAL_IGUAL || tipo === Tipos.RELACIONAL_DIFERENTE) {
        let opIzq = { valor: 0, tipo: op1.tipo };
        let opDer = { valor: 0, tipo: op2.tipo };
        if (op1.tipo === Tipos.FUNCION_LAST && op2.tipo === Tipos.NUMBER) {
            opIzq.valor = _ambito.length;
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_LAST) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _ambito.length;
        }
        else if (op1.tipo === Tipos.FUNCION_POSITION && op2.tipo === Tipos.NUMBER) {
            opIzq.valor = _ambito.length;
            opDer.valor = Number(op2.valor);
        }
        else if (op1.tipo === Tipos.NUMBER && op2.tipo === Tipos.FUNCION_POSITION) {
            opIzq.valor = Number(op1.valor);
            opDer.valor = _ambito.length;
        }
        // else { // Falta
        // op1 = { valor: op1, tipo: tipo };
        // op2 = { valor: op2, tipo: tipo };
        // }
        return { op1: opIzq, op2: opDer, tipo: tipo };
    }
    return { op1: op1, op2: op2, tipo: tipo };
}

function mayor(_opIzq: number, _opDer: number) {
    return {
        valor: (_opDer + 1),
        tipo: Tipos.RELACIONAL_MAYOR
    }
}

function mayorigual(_opIzq: number, _opDer: number) {
    return {
        valor: _opDer,
        tipo: Tipos.RELACIONAL_MAYORIGUAL
    }
}

function menor(_opIzq: number, _opDer: number) {
    return {
        valor: (_opDer - 1),
        tipo: Tipos.RELACIONAL_MENOR
    }
}

function menorigual(_opIzq: number, _opDer: number) {
    return {
        valor: _opDer,
        tipo: Tipos.RELACIONAL_MENORIGUAL
    }
}

function igual(_opIzq: any, _opDer: any) {
    if (_opIzq.tipo === Tipos.FUNCION_POSITION || _opDer.tipo === Tipos.FUNCION_POSITION)
        return { valor: ((_opIzq.tipo === Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)), tipo: Tipos.NUMBER }
    if (_opIzq.tipo === Tipos.FUNCION_LAST || _opDer.tipo === Tipos.FUNCION_LAST)
        return { valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)), tipo: Tipos.NUMBER }
    return {
        valor: (_opIzq == _opDer),
        tipo: Tipos.RELACIONAL_IGUAL
    }
}

function diferente(_opIzq: any, _opDer: any) {
    if (_opIzq.tipo === Tipos.FUNCION_POSITION || _opDer.tipo === Tipos.FUNCION_POSITION) {
        return {
            valor: ((_opIzq.tipo === Tipos.FUNCION_POSITION) ? (_opDer.valor) : (_opIzq.valor)),
            tipo: Tipos.EXCLUDE
        }
    }
    if (_opIzq.tipo === Tipos.FUNCION_LAST || _opDer.tipo === Tipos.FUNCION_LAST) {
        return {
            valor: ((_opIzq.valor == _opDer.valor) ? (_opDer.valor) : (-1)),
            tipo: Tipos.EXCLUDE
        }
    }
    return {
        valor: (_opIzq != _opDer),
        tipo: Tipos.RELACIONAL_DIFERENTE
    }
}

export =  Relacional;