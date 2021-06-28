import { Element } from "../model/xml/Element";
import { Atributo } from "../model/xml/Atributo";
import { Tipos } from "../model/xpath/Enum";

export class Contexto {

    elementos: Array<Element>;
    atributos: Array<Atributo>;
    texto: Array<string>;
    nodos: Array<any>;
    cadena: Tipos;
    error: any;
    notFound: any;

    // Numéricos
    items: Array<any>;

    constructor() {
        this.elementos = [];
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

    pushItem(_v: any) {
        this.items.push(_v);
    }

    removeDuplicates() { // Elimina duplicados
        this.elementos = this.elementos.filter((v, i, a) => a.findIndex(t => (t.line === v.line && t.column === v.column)) === i);
    }

    getLength(): number {
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
