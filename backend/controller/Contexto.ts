import { Element } from "../model/xml/Element";
import { Atributo } from "../model/xml/Atributo";
import { Tipos } from "../model/xpath/Enum";
import { Variable } from "../model/xml/Ambito/Variable";

export class Contexto {

    elementos: Array<Element>;
    atributos: Array<Atributo>;
    texto: Array<string>;
    nodos: Array<any>;
    cadena: Tipos;
    error: any;
    notFound: any;

    // Numéricos
    items: Array<number>;

    // XQuery Vars
    variable?: Variable;
    atCounter?: Variable;

    constructor(_elementos?: Array<Element>) {
        this.elementos = (_elementos) ? (_elementos) : [];
        this.atributos = [];
        this.texto = [];
        this.nodos = [];
        this.cadena = Tipos.NONE;
        this.error = this.notFound = null;
        this.items = [];
    }

    pushElement(_v: Element) {
        this.elementos.push(_v);
    }

    pushAttribute(_v: Atributo) {
        this.atributos.push(_v);
    }

    pushText(_v: string) {
        this.texto.push(_v);
    }

    pushNode(_v: any) {
        this.nodos.push(_v);
    }

    pushItem(_v: number) {
        this.items.push(_v);
    }

    removeDuplicates() { // Elimina duplicados
        if (this.elementos.length > 0) {
            this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.line === v.line && t.column === v.column)) === i);
        }
    }

    removeDadDuplicates(): Array<any> {
        this.removeDuplicates();
        if (this.atributos.length > 0)
            this.atributos = this.atributos.filter((v, i, a) => a.findIndex(t => (t.line === v.line)) === i);
        this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.father.line === v.father.line && t.father.column === v.father.column)) === i);
        return this.getArray();
    }

    getLength(): number {
        if (this.items.length > 0)
            return this.items.length;
        if (this.atributos.length > 0)
            return this.atributos.length;
        if (this.elementos.length > 0)
            return this.elementos.length;
        if (this.texto.length > 0)
            return this.texto.length;
        if (this.nodos.length > 0)
            return this.nodos.length;
        return 0;
    }

    getArray(): Array<any> {
        if (this.atributos.length > 0)
            return this.atributos;
        if (this.elementos.length > 0)
            return this.elementos;
        if (this.texto.length > 0)
            return this.texto;
        if (this.nodos.length > 0)
            return this.nodos;
        return [];
    }

    public set setCadena(v: Tipos) {
        this.cadena = v;
    }

    public set setElements(v: Array<Element>) {
        this.elementos = v;
    }

    public set setAttributes(v: Array<Atributo>) {
        this.atributos = v;
    }

    public set setTexto(v: Array<string>) {
        this.texto = v;
    }

    public set setNodos(v: Array<any>) {
        this.nodos = v;
    }

}
