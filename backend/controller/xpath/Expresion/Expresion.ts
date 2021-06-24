import { Ambito } from "../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../model/xpath/Enum";
import { Element } from "../../../model/xml/Element"
import pushIterators from "../../xquery/BuildElement";

function Expresion(_expresion: any, _ambito: Ambito, _contexto: Array<Element>, id?: any): any {
    // if (!_expresion) return null;
    let tipo: Tipos = _expresion.tipo;
    if (tipo === Tipos.EXPRESION) {
        return Expresion(_expresion.expresion, _ambito, _contexto);
    }
    else if (tipo === Tipos.NODENAME) {
        return { valor: _expresion.nodename, tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.STRING || tipo === Tipos.NUMBER) {
        return _expresion;
    }
    else if (tipo === Tipos.SELECT_CURRENT) {
        return { valor: ".", tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_PARENT) {
        return { valor: "..", tipo: Tipos.ELEMENTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_ATTRIBUTES) {
        return { valor: _expresion.expresion, tipo: Tipos.ATRIBUTOS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.SELECT_AXIS) {
        let nodetest = Expresion(_expresion.nodetest.expresion, _ambito, _contexto);
        if (nodetest.error) return nodetest;
        return { axisname: _expresion.axisname, nodetest: nodetest, predicate: _expresion.nodetest.predicate, tipo: Tipos.SELECT_AXIS, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.ASTERISCO) {
        return { valor: "*", tipo: Tipos.ASTERISCO, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_NODE) {
        return { valor: "node()", tipo: Tipos.FUNCION_NODE, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_LAST) {
        return { valor: "last()", tipo: Tipos.FUNCION_LAST, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_POSITION) {
        return { valor: "position()", tipo: Tipos.FUNCION_POSITION, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.FUNCION_TEXT) {
        return { valor: "text()", tipo: Tipos.FUNCION_TEXT, linea: _expresion.linea, columna: _expresion.columna };
    }
    else if (tipo === Tipos.OPERACION_SUMA || tipo === Tipos.OPERACION_RESTA || tipo === Tipos.OPERACION_MULTIPLICACION
        || tipo === Tipos.OPERACION_DIVISION || tipo === Tipos.OPERACION_MODULO || tipo === Tipos.OPERACION_NEGACION_UNARIA) {
        const Aritmetica = require("./Operators/Aritmetica");
        return Aritmetica(_expresion, _ambito, _contexto);
    }
    else if (tipo === Tipos.RELACIONAL_MAYOR || tipo === Tipos.RELACIONAL_MAYORIGUAL
        || tipo === Tipos.RELACIONAL_MENOR || tipo === Tipos.RELACIONAL_MENORIGUAL
        || tipo === Tipos.RELACIONAL_IGUAL || tipo === Tipos.RELACIONAL_DIFERENTE) {
        const Relacional = require("./Operators/Relacional");
        return Relacional(_expresion, _ambito, _contexto);
    }
    else if (tipo === Tipos.LOGICA_AND || tipo === Tipos.LOGICA_OR) {
        const Logica = require("./Operators/Logica");
        return Logica(_expresion, _ambito, _contexto);
    }

    // Fase 2
    else if (tipo === Tipos.HTML) {
        let content = [];
        for (let i = 0; i < _expresion.value.length; i++) {
            const value = Expresion(_expresion.value[i], _ambito, _contexto, id);
            console.log(value, 99999999, id)
            // if (Array.isArray(value)) { if (value.length > 0) content.push(value); }
            if (value)
                content.push(value);
            else
                content.pop();
        }
        return content;
    }

    else if (tipo === Tipos.CONTENIDO) {
        return { valor: _expresion.contenido };
    }

    else if (tipo === Tipos.INYECCION) {
        let e_0 = Expresion(_expresion.path[0], _ambito, _contexto, id);
        if (e_0.valor != id) return null;
        if (_contexto[0].item) return _contexto
        const Bloque = require("../Instruccion/Bloque");
        let elements: Array<any> = [];
        elements.push(e_0);
        let _x = Bloque.getIterators(_expresion.path, _ambito, _contexto[0]);
        if (_x && _x.length > 0)
            elements = elements.concat(_x);
        return pushIterators(elements);
    }

    if (Array.isArray(_expresion)) {
        const Bloque = require("../Instruccion/Bloque");
        const elements = Bloque.getIterators(_expresion, _ambito, _contexto);
        return elements; //<- Retorna un arreglo de elementos
    }

    else if (tipo === Tipos.INTERVALO) {
        let iterators = [];
        let val_1 = Expresion(_expresion.valor1, _ambito, _contexto); if (val_1.error) return val_1;
        let val_2 = Expresion(_expresion.valor2, _ambito, _contexto); if (val_2.error) return val_2;
        for (let i = parseInt(val_1.valor); i <= parseInt(val_2.valor); i++) {
            iterators.push({ item: i });
        }
        return iterators;
    }

    else if (tipo === Tipos.VALORES) {
        let iterators: Array<any> = [];
        _expresion.valores.forEach((valor: any) => {
            const expresion = Expresion(valor, _ambito, _contexto);
            if (!expresion.error)
                iterators.push({ item: parseInt(expresion.valor) });
        });
        return iterators;
    }

    else {
        console.log(_expresion, "Expresión no procesada.")
        return { error: "Error: Expresión no procesada.", tipo: "Semántico", origen: "Query", linea: _expresion.linea, columna: _expresion.columna };
    }
}

export = Expresion;