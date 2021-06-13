import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Atributo } from "../../../../model/xml/Atributo";
import { Element } from "../../../../model/xml/Element";
import { Tipos } from "../../../../model/xpath/Enum";
import Expresion from "../../Expresion/Expresion";

export class Predicate {

    predicado: Array<any>;
    contexto: Array<Element>;
    ambito: Ambito;

    constructor(_predicado: Array<any>, _ambito: Ambito, _contexto: Array<Element>) {
        this.predicado = _predicado;
        this.contexto = _contexto;
        this.ambito = _ambito;
    }

    public set setContext(v: Array<Element>) {
        this.contexto = v;
    }

    filterElements() {
        let expresion: any;
        for (let i = 0; i < this.predicado.length; i++) {
            const e = this.predicado[i];
            console.log(e,8277237281)
            expresion = Expresion(e.condicion, this.ambito, this.contexto);
            if (expresion.err) return expresion;
            // En caso de ser una posición en los elementos
            if (expresion.tipo === Tipos.NUMBER) {
                let index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= this.contexto.length)
                    this.contexto = [];
                else
                    this.contexto = [this.contexto[index]];
            }
            else if (expresion.tipo === Tipos.FUNCION_LAST) {
                let index = this.contexto.length - 1;
                this.contexto = [this.contexto[index]];
            }
            else if (expresion.tipo === Tipos.FUNCION_POSITION) {
                return this.contexto;
            }
            else if (expresion.tipo === Tipos.RELACIONAL_MENORIGUAL || expresion.tipo === Tipos.RELACIONAL_MENOR) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= this.contexto.length) index = this.contexto.length - 1;
                let tmp = [];
                for (let i = index; i <= this.contexto.length && i >= 0; i--) {
                    const element = this.contexto[i];
                    tmp.push(element);
                }
                this.contexto = tmp;
            }
            else if (expresion.tipo === Tipos.RELACIONAL_MAYORIGUAL || expresion.tipo === Tipos.RELACIONAL_MAYOR) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= this.contexto.length) { this.contexto = []; return this.contexto; }
                if (index <= 0) index = 0;
                let tmp = [];
                for (let i = index; i < this.contexto.length; i++) {
                    const element = this.contexto[i];
                    tmp.push(element);
                }
                this.contexto = tmp;
            }
            else if (expresion.tipo === Tipos.RELACIONAL_IGUAL || expresion.tipo === Tipos.RELACIONAL_DIFERENTE) {
                let flag: boolean = expresion.valor;
                if (!flag)
                    this.contexto = [];
            }
            else if (expresion.tipo === Tipos.EXCLUDE) {
                let index = parseInt(expresion.valor) - 1;
                if (index >= 0 && index < this.contexto.length) {
                    let tmp = [];
                    for (let i = 0; i < this.contexto.length; i++) {
                        const element = this.contexto[i];
                        if (i != index) tmp.push(element);
                    }
                    this.contexto = tmp;
                }
            }
        }
        return this.contexto;
    }

    filterAttributes(_attributes: Array<Atributo>) {
        let expresion: any;
        for (let i = 0; i < this.predicado.length; i++) {
            const e = this.predicado[i];
            expresion = Expresion(e.condicion, this.ambito, this.contexto);
            if (expresion.err) return expresion;
            // En caso de ser una posición en los elementos
            if (expresion.tipo === Tipos.NUMBER) {
                let index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _attributes.length)
                    _attributes = [];
                else
                    _attributes = [_attributes[index]];
            }
            else if (expresion.tipo === Tipos.FUNCION_LAST) {
                let index = _attributes.length - 1;
                _attributes = [_attributes[index]];
            }
            else if (expresion.tipo === Tipos.FUNCION_POSITION) {
                return _attributes;
            }
        }
        return _attributes;
    }

    filterNodes(_nodes: Array<any>) {
        let expresion: any;
        for (let i = 0; i < this.predicado.length; i++) {
            const e = this.predicado[i];
            expresion = Expresion(e.condicion, this.ambito, this.contexto);
            if (expresion.err) return expresion;
            // En caso de ser una posición en los elementos
            if (expresion.tipo === Tipos.NUMBER) {
                let index = parseInt(expresion.valor) - 1;
                if (index < 0 || index >= _nodes.length)
                    _nodes = [];
                else
                    _nodes = [_nodes[index]];
            }
            else if (expresion.tipo === Tipos.FUNCION_LAST) {
                let index = _nodes.length - 1;
                _nodes = [_nodes[index]];
            }
            else if (expresion.tipo === Tipos.FUNCION_POSITION) {
                return _nodes;
            }
        }
        return _nodes;
    }

}