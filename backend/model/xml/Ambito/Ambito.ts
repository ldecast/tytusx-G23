import { Atributo } from "../Atributo";
import { Element } from "../Element";

export class Ambito {

    anterior: Ambito;
    tipo: string;
    tablaSimbolos: Array<Element>;

    constructor(_anterior: any, _tipo: string) {
        this.anterior = _anterior
        this.tipo = _tipo
        this.tablaSimbolos = [];
    }

    isGlobal(): boolean {
        return this.tipo === "global";
    }

    addSimbolo(_simbolo: Element) {
        this.tablaSimbolos.push(_simbolo);
    }

    getSimbolo(_s: Element) {
        let e: Ambito;
        for (e = this; e != null; e = e.anterior) {
            var encontrado = e.tablaSimbolos.find(element => element === _s);
            if (encontrado)
                return encontrado
        }
        return null
    }

    existeSimbolo(_s: Element): boolean {
        if (this.getSimbolo(_s) !== null)
            return true
        else
            return false
    }

    actualizar(_s: Element, _simbolo: Element) {
        let e: Ambito;
        let i = 0;
        for (e = this; e != null; e = e.anterior) {
            var encontrado = e.tablaSimbolos.find(element => element === _s);
            if (encontrado) {
                this.tablaSimbolos[i] = _s;
                break;
            }
            i++;
        }
    }

    getGlobal() {
        let e: Ambito;
        for (e = this; e != null; e = e.anterior) {
            if (e.anterior === null)
                return e;
        }
        return null
    }

    concatAttributes(attributes: Array<Atributo>) {
        let concat = "";
        attributes.forEach(attr => {
            concat = concat + attr.id + ": " + attr.value + ", ";
        });
        return concat.substring(0, concat.length - 2);
    }

    getArraySymbols() {
        let simbolos: any = [];
        console.log("tabla", this.tablaSimbolos);
        try {
            this.tablaSimbolos.forEach(element => {
                if (element.childs) {
                    let dad = this.createSymbol(element, (element.father === null ? "global" : element.father));
                    simbolos.push(dad);
                    simbolos.concat(this.toRunTree(simbolos, element.childs, dad.id));
                }
                else {
                    let symb = this.createSymbol(element, (element.father === null ? "global" : element.father));
                    simbolos.push(symb);
                }
            });
            return simbolos;
        } catch (error) {
            console.log(error);
            return simbolos;
        }
    }

    toRunTree(_symbols: Array<any>, _array: Array<Element>, _father: string) {
        _array.forEach(element => {
            if (element.childs) {
                let dad = this.createSymbol(element, _father);
                _symbols.push(dad);
                let concat = _father + ("->" + dad.id);
                _symbols.concat(this.toRunTree(_symbols, element.childs, concat));
            }
            else {
                let symb = this.createSymbol(element, _father);
                _symbols.push(symb);
            }
        });
        return _symbols;
    }

    createSymbol(_element: Element, _entorno: string) {
        let type = (_element.id_close === null ? 'Simple' : 'Doble');
        let attr = (_element.attributes === null ? '' : this.concatAttributes(_element.attributes));
        var symb = {
            id: _element.id_open,
            value: _element.value,
            tipo: type,
            entorno: _entorno,
            atributos: attr,
            linea: _element.line,
            columna: _element.column
        }
        return symb;
    }

}
