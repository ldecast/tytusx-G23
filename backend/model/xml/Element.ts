import { Atributo } from "./Atributo";

export class Element {

    id_open: string;
    id_close: string;
    value: string; // Si tiene hijos no debería tener valor
    attributes: Array<Atributo>; // Lista de posibles atributos
    father: any;
    childs: Array<Element>; // Lista de otros posibles hijos
    line: string;
    column: string;

    constructor(id_open: string, attributes: Array<Atributo>, value: string, childs: Array<Element>, line: string, column: string, id_close: string) {
        this.id_open = id_open;
        this.id_close = id_close;
        this.attributes = attributes;
        this.value = value;
        this.childs = childs;
        this.line = line;
        this.column = column;
        this.father = null;
    }

    verificateNames(): boolean {
        return this.id_open === this.id_close;
    }

}