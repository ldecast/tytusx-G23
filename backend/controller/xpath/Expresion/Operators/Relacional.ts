import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";

function Relacional(_expresion: any, _ambito: Ambito) {
    switch (_expresion.tipo) {
        case Tipos.RELACIONAL_MAYOR:
            return mayor(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.RELACIONAL_MAYORIGUAL:
            return mayorigual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.RELACIONAL_MENOR:
            return menor(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.RELACIONAL_MENORIGUAL:
            return menorigual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.RELACIONAL_IGUAL:
            return igual(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.RELACIONAL_DIFERENTE:
            return diferente(_expresion.opIzq, _expresion.opDer, _ambito);
        default:
            break;
    }
}

function mayor(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

function mayorigual(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

function menor(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

function menorigual(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

function igual(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

function diferente(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

export =  Relacional;