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

    verificateNames(): string {
        if ((this.id_close !== null) && (this.id_open !== this.id_close))
            return "La etiqueta de apertura no coincide con la de cierre.";
        if (this.id_open.replace(/\s/g, '').toLowerCase() === "xml")
            return "No se puede nombrar una etiqueta con las letras XML";
        return "";
    }

}