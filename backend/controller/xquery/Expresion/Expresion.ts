import { Tipos } from "../../../model/xpath/Enum";
import { Ambito } from "../../../model/xml/Ambito/Ambito";
import Expresion from "../../xpath/Expresion/Expresion";
import { Contexto } from "../../Contexto";
import { Variable } from "../../../model/xml/Ambito/Variable";

function ExpresionQuery(_expresion: any, _ambito: Ambito, _contexto: Contexto, id?: any): any {
    let tipo: Tipos = _expresion.tipo;

    if (tipo === Tipos.DECLARACION) {
        let contexto = new Contexto();
        let id = Expresion(_expresion.variable, _ambito, _contexto);
        let it = Expresion(_expresion.iterators, _ambito, _contexto);
        if (id.valor && it) {
            contexto = it;
            contexto.variable = new Variable(id.valor, Tipos.VARIABLE);
            if (_expresion.atKey)
                contexto.atCounter = new Variable(_expresion.atKey.variable, Tipos.VARIABLE);
        }
        return contexto;
    }

    if (tipo === Tipos.VARIABLE) {
        if (id && _contexto.cadena != Tipos.NONE) {
            if (id === _expresion.variable)
                return _contexto;
            else return null;
        }
        return { valor: _expresion.variable };
    }

    if (tipo === Tipos.INTERVALO) {
        let contexto = new Contexto();
        let val_1 = Expresion(_expresion.valor1[0], _ambito, _contexto); if (!val_1 || val_1.error) return val_1;
        let val_2 = Expresion(_expresion.valor2[0], _ambito, _contexto); if (!val_2 || val_2.error) return val_2;
        for (let i = parseInt(val_1.valor); i <= parseInt(val_2.valor); i++) {
            contexto.items.push(i);
        }
        contexto.variable = new Variable(id, Tipos.VARIABLE);
        contexto.cadena = Tipos.INTERVALO;
        return contexto;
    }

    if (tipo === Tipos.VALORES) {
        let contexto = new Contexto();
        _expresion.valores.forEach((valor: any) => {
            const expresion = Expresion(valor[0], _ambito, _contexto);
            if (expresion && !expresion.error)
                contexto.items.push(parseInt(expresion.valor));
        });
        contexto.variable = new Variable(id, Tipos.VARIABLE);
        contexto.cadena = Tipos.VALORES;
        return contexto;
    }

    if (tipo === Tipos.HTML) {
        let content: Array<any> = [];
        for (let i = 0; i < _expresion.value.length; i++) {
            const value = Expresion(_expresion.value[i], _ambito, _contexto, id);
            if (value)
                content = content.concat(value);
            // else
            //     content.pop();
        }
        return content;
    }

    if (tipo === Tipos.CONTENIDO) {
        return { valor: _expresion.contenido };
    }

    if (tipo === Tipos.INYECCION) {
        let e_0 = Expresion(_expresion.path[0], _ambito, _contexto, id);
        if (!e_0) return null;
        if (_contexto.items.length > 0) return _contexto;
        const Bloque = require("../Bloque_XQuery");
        let elements: Array<any> = [];
        /* elements.push(e_0); */
        let _x = Bloque.getIterators(_expresion.path, _ambito, _contexto, id);
        if (_x && _x.length > 0) {
            _contexto = _x;
            elements = elements.concat(_x);
        }
        return elements;
    }

    else {
        // console.log(_expresion, 4444);
        const Bloque = require('../Bloque_XQuery');
        let _iterators = Bloque.getIterators(_expresion, _ambito, _contexto, id);
        if (_iterators === null) return null;
        return _iterators;
    }
}

export = ExpresionQuery;