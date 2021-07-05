import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    this.entrada = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>

  <book category="COOKING">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>

  <book category="CHILDREN">
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>

  <book category="WEB">
    <title lang="en">XQuery Kick Start</title>
    <author>James McGovern</author>
    <author>Per Bothner</author>
    <author>Kurt Cagle</author>
    <author>James Linn</author>
    <author>Vaidyanathan Nagarajan</author>
    <year>2003</year>
    <price>49.99</price>
  </book>

  <book category="WEB">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>

</bookstore>`;

    this.consulta = `for $x in /bookstore/book
where $x/price>30
order by $x/title
return $x/title`;

    this.salida = `<title lang="en">Learning XML</title>
<title lang="en">XQuery Kick Start</title>`

    this.traduccion = `#include <stdio.h>

int main()
{
  return 0;
}
`;
    this.simbolos = this.errores = [];
    this.fname = ['input.xml', 'query.txt', 'translation.c'];

  }

  XMLOptions = {
    theme: "vs-dark",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 13,
    minimap: {
      enabled: true
    },
    language: 'xml'
  }

  QueryOptions = {
    theme: "vs-dark",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 13.5,
    minimap: {
      enabled: true
    },
    language: 'sql'
  }

  C3DOptions = {
    theme: "vs-dark",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 13,
    minimap: {
      enabled: true
    },
    language: 'c'
  }

  ConsoleOptions = {
    theme: "vs-dark",
    readOnly: true,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 14,
    minimap: {
      enabled: true
    },
    language: 'xml'
  }

  entrada: string;
  consulta: string;
  traduccion: string;
  salida: string;
  fname: Array<string>;
  simbolos: Array<any>;
  errores: Array<any>;

  newTab() {
    window.open("/tytusx/20211SVAC/G23", "_blank");
  }

  closeTab() {
    window.close();
  }

  onSubmit() {
    var iconvlite = require('iconv-lite');
    let grammar_value = (<HTMLSelectElement>document.getElementById('grammar_selector')).value;
    if (this.entrada != "" && this.consulta != "" && this.entrada != '<?xml version="1.0" encoding="UTF-8"?>') {
      const x = {
        xml: this.entrada, // documento XML
        query: this.consulta, // consultas
        grammar: Number(grammar_value) // gramática 1=ascendente, 2=descendente
      }
      // llamo a la función compile que devuelve un objeto de retorno
      let data = require('../js/routes/compile').compile(x);
      if (data.encoding == "ascii" || data.encoding == "latin1") this.salida = iconvlite.decode(data.output, data.encoding);
      else this.salida = data.output;
      this.errores = data.arreglo_errores;
      this.simbolos = data.arreglo_simbolos;
      console.log('Data received!');
    } else
      alert("Alguna entrada se encuentra vacía. Intente de nuevo.");
  }

  codigoIntermedio() {
    if (this.entrada != "" && this.consulta != "" && this.entrada != '<?xml version="1.0" encoding="UTF-8"?>') {
      const x = {
        xml: this.entrada, // documento XML
        query: this.consulta, // consultas
      }
      let data = require('../js/routes/translate').translate(x);
      this.traduccion = data.output;
      this.errores = data.arreglo_errores;
      console.log('Data received!');
    } else
      alert("Alguna entrada se encuentra vacía. Intente de nuevo.");
  }

  optimizarC3D() {
    if (this.traduccion != "") {
      const x = {
        traduccion: this.traduccion, // documento XML
      }
      let data = require('../js/routes/optimizar').optimizar(x);
      if (data.optimizado) this.traduccion = data.optimizado;
      this.errores = data.arreglo_errores;
      if (data.html)
        this.exportFile(data.html, "C3D.html");
      console.log('Data received!');
    } else
      alert("Alguna entrada se encuentra vacía. Intente de nuevo.");
  }

  getAST() {
    if (this.consulta != "") {
      let grammar_value = (<HTMLSelectElement>document.getElementById('grammar_selector')).value;
      const x = {
        xml: this.entrada, // documento XML
        query: this.consulta, // consultas
        grammar: Number(grammar_value), // gramática 1=ascendente, 2=descendente
        report: "XPATH-AST",
      }
      let data = require('../js/routes/reports').generateReport(x);
      this.salida = data.output;
      this.errores = data.arreglo_errores;
      this.exportFile(data.ast, "AST.html");
      console.log('AST received!');
    } else
      alert("Entrada vacía. No se puede generar el reporte AST.");
  }

  getCST() {
    if (this.entrada != "") {
      let grammar_value = (<HTMLSelectElement>document.getElementById('grammar_selector')).value;
      const x = {
        xml: this.entrada, // documento XML
        query: this.consulta, // consultas
        grammar: Number(grammar_value), // gramática 1=ascendente, 2=descendente
        report: "XML-CST",
      }
      let data = require('../js/routes/reports').generateReport(x);
      this.salida = data.output;
      this.errores = data.arreglo_errores;
      this.exportFile(data.cst, "CST.html");
      console.log('CST received!');
    } else
      alert("Entrada vacía. No se puede generar el reporte CST.");
  }

  getGrammarReport() {
    if (this.entrada != "") {
      let grammar_value = (<HTMLSelectElement>document.getElementById('grammar_selector')).value;
      const x = {
        xml: this.entrada, // documento XML
        query: this.consulta, // consultas
        grammar: Number(grammar_value), // gramática 1=ascendente, 2=descendente
        report: "XML-GRAMMAR",
      }
      let data = require('../js/routes/reports').generateReport(x);
      this.salida = data.output;
      this.errores = data.arreglo_errores;
      this.exportFile(data.grammar_report, "Grammar report.html");
      console.log('Grammar report received!');
    } else
      alert("Entrada vacía. No se puede generar el reporte gramatical.");
  }

  getC3D() {
    if (this.traduccion != "") {
      let grammar_value = (<HTMLSelectElement>document.getElementById('grammar_selector')).value;
      const x = {
        traduccion: this.traduccion, // código 3d
        grammar: Number(grammar_value), // gramática 1=ascendente, 2=descendente
        report: "C3D-AST",
      }
      let data = require('../js/routes/reports').generateReport(x);
      this.salida = data.output;
      this.exportFile(data.ast, "3CD Report.dot");
      console.log('AST C3D received!');
    } else
      alert("Traducción vacía. No se puede generar el reporte de C3D.");
  }

  exportFile(data: string, fname: string) {
    this.simbolos = [];
    this.errores = [];
    var f = document.createElement('a');
    f.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    f.setAttribute('download', fname);
    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      f.dispatchEvent(event);
    }
    else {
      f.click();
    }
    console.log('File exported!');
  }

  saveFile(id: number) {
    var f = document.createElement('a');
    let data = "";
    if (id === 1)
      data = this.entrada;
    else if (id === 2)
      data = this.consulta;
    else if (id === 3)
      data = this.traduccion;
    f.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    f.setAttribute('download', this.fname[id - 1].replace("C:\\fakepath\\", ""));
    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      f.dispatchEvent(event);
    }
    else {
      f.click();
    }
    console.log('File saved!');
  }

  openDialog(id: number) {
    if (id === 1)
      document.getElementById("fileInput1")!.click();
    else if (id === 2)
      document.getElementById("fileInput2")!.click();
    else if (id === 3)
      document.getElementById("fileInput3")!.click();
  }

  readFile(event: any, id: number) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = () => {
      var text = reader.result;
      if (text) {
        switch (id) {
          case 1:
            this.entrada = String(text);
            this.consulta = '';
            break;
          case 2:
            this.consulta = String(text);
            break;
          case 3:
            this.traduccion = String(text);
            break;
        }
      }
    }
    reader.readAsText(input.files[0]);
    this.salida = '';
    console.log('File opened!')
  }

  cleanEditor(id: number) {
    switch (id) {
      case 1:
        this.entrada = "";
        break;
      case 2:
        this.consulta = "";
        break;
      case 3:
        this.traduccion = "";
    }
    this.salida = "";
  }

}
