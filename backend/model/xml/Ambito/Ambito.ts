import { Atributo } from "../Atributo";
import { Element } from "../Element";

export class Ambito {

    anterior: Ambito;
    tipo: string;
    tablaSimbolos: Array<Element>;

    constructor(_anterior: Ambito, _tipo: string) {
        this.anterior = _anterior
        this.tipo = _tipo
        this.tablaSimbolos = [];
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

    concatenarAtributos(attributes: Array<Atributo>) {
        let concat = "";
        attributes.forEach(attr => {
            concat = concat + attr.value + "\n";
        });
        return concat.substring(0, concat.length - 2);
    }

    getArraySimbols() { 
        let simbolos: any = [];
        try {
            this.tablaSimbolos.forEach(element => {
                let type = (element.id_close === null ? 'Etiqueta simple' : 'Etiqueta doble');
                let attr = (element.attributes === null ? this.concatenarAtributos(element.attributes) : '');
                var simb = {
                    id: element.id_open,
                    value: element.value,
                    tipo: type,
                    entorno: element.father,
                    atributos: attr,
                    linea: element.line,
                    columna: element.column
                }
                if (!simbolos.some((e: any) => e === simb)) {
                    simbolos.push(simb);
                }
            });
            return simbolos;
        } catch (error) {
            return simbolos;
        }
    }

}

module.exports = Ambito