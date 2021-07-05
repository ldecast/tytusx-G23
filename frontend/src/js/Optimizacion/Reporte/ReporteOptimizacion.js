"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteOptimizacion = void 0;
class ReporteOptimizacion {
    constructor() {
        this.reporte = new Array();
    }
    ReporteOptimizacion() {
        this.reporte = new Array();
    }
    agregarOpt(opt) {
        this.reporte.push(opt);
    }
    esVacio() {
        return this.reporte.length == 0;
    }
    retornarstrig() {
        return;
    }
    //CREAR METODO PARA GENERAR EL REPORTE DE OPTIMIZACION
    generarReporteOptimizacion() {
        this.css = this.estiloTabla();
        let html = this.escribirTablaOptimizacion();
        this.generarArchivoOptimizacion(html);
        return this.htmlg;
    }
    estiloTabla() {
        let css;
        css = "body {background-color: #d0efb141;font-family: calibri, Helvetica, Arial;}\n";
        css += "h1 {text-align: center;font-size: 100px;}\n";
        css += "table {width: 100%;border-collapse: collapse;font-size: 25px;font-weight: bold;}\n";
        css += "table td, table th, table caption {border: 0px dashed #77A6B6;padding: 10px;}\n";
        css += "table tr:nth-child(even){ background-color: #9DC3C2; }\n";
        css += "table tr:nth-child(odd){ background-color: #B3D89C; }\n";
        css += "table tr:hover {background-color: #77A6B6;color: #feffff;}\n";
        css += "table th, table caption {color: white;background-color: #4d7298;text-align: left;padding-top: 12px;padding-bottom: 12px;}\n";
        css += ".content {width: 90%;margin: 0 auto;}";
        return css;
    }
    escribirTablaOptimizacion() {
        let html = "<!Doctype html>\n<html lang=\"es-Es\">\n<head>\n";
        html += "<style>\n" + this.css + "\n</style>\n";
        html += "<title>Reporte Optimizacion</title>\n</head>\n<body>\n<h1><center>Reporte de Optimización</center></h1>\n<table style=\"margin: 0 auto;\">\n";
        html += "<thead>\n<tr>\n<th>Tipo</th>\n<th>Regla</th>\n<th>Código eliminado</th>\n<th>Código agregado</th>\n<th>Fila</th>\n</tr>\n</thead>\n<tbody>\n";
        //RECORRERMOS EL REPORTE
        this.reporte.forEach(Element => {
            html += "<tr>\n";
            html += "<td>" + Element.tipo + "</td>\n";
            html += "<td>" + Element.regla + "</td>\n";
            html += "<td>" + Element.antes + "</td>\n";
            html += "<td>" + Element.despues + "</td>\n";
            html += "<td>" + Element.linea + "</td>\n";
            html += "</tr>\n";
        });
        html += "</tbody>\n</table>\n</body>\n</html>";
        this.htmlg = html;
        return html;
    }
    generarArchivoOptimizacion(html) {
        // TextWriter archivo;
        // archivo = new StreamWriter("C:\\compiladores2\\ReporteOpti.html");
        // archivo.WriteLine(html);
        // archivo.Close();
    }
}
exports.ReporteOptimizacion = ReporteOptimizacion;
