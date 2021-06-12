import { Ambito } from "../../../../model/xml/Ambito/Ambito";
import { Tipos } from "../../../../model/xpath/Enum";

function Logica(_expresion: any, _ambito: Ambito) {
    switch (_expresion.tipo) {
        case Tipos.LOGICA_AND:
            return and(_expresion.opIzq, _expresion.opDer, _ambito);
        case Tipos.LOGICA_OR:
            return or(_expresion.opIzq, _expresion.opDer, _ambito);
        default:
            break;
    }
}

function and(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

function or(_opIzq: any, _opDer: any, _ambito: Ambito) {

}

export = Logica;