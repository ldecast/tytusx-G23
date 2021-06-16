import { Component } from '@angular/core';
import { AppService } from './app.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private appService: AppService) { }

  EditorOptions = {
    theme: "vs-dark",
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 14,
    minimap: {
      enabled: true
    },
    language: 'xml'
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

  entrada: string = `<?xml version="1.0" encoding="ISO-8859-1"?>
  <catalog>
     <book id="bk101">
        <author>Gámbardellä, Mátthew</author>
        <title>XML Developer&apos;s Guide</title>
        <genre>Computer</genre>
        <price>44.95</price>
        <publish_date>2000-10-01</publish_date>
        <description>An in-depth look at creating applications 
        with XML.</description>
     </book>
     <book id="bk102">
        <author>Ralls, Kim</author>
        <title>Midnight Rain</title>
        <genre>Fantasy</genre>
        <price>5.95</price>
        <publish_date>2000-12-16</publish_date>
        <description>A former architect battles corporate zombies, 
        an evil sorceress, and her own childhood to become queen 
        of the world.</description>
     </book>
     <book id="bk103">
        <author>Corets, Eva</author>
        <title>Maeve Ascendant</title>
        <genre>Fantasy</genre>
        <price>5.95</price>
        <publish_date>2000-11-17</publish_date>
        <description>After the collapse of a nanotechnology 
        society in England, the young survivors lay the 
        foundation for a new society.</description>
     </book>
     <book id="bk104">
        <author>Corets, Eva</author>
        <title>Oberon's Legacy</title>
        <genre>Fantasy</genre>
        <price>5.95</price>
        <publish_date>2001-03-10</publish_date>
        <description>In post-apocalypse England, the mysterious 
        agent known only as Oberon helps to create a new life 
        for the inhabitants of London. Sequel to Maeve 
        Ascendant.</description>
     </book>
     <book id="bk105">
        <author>Corets, Eva</author>
        <title>The Sundered Grail</title>
        <genre top="cali">Fantasy</genre>
        <price>5.95</price>
        <publish_date>2001-09-10</publish_date>
        <description>The two daughters of Maeve, half-sisters, 
        battle one another for control of England. Sequel to 
        Oberon's Legacy.</description>
     </book>
     <book id="bk106">
        <author>Randall, Cynthia</author>
        <title>Lover Birds</title>
        <genre top="cali">Romance</genre>
        <price>4.95</price>
        <publish_date>2000-09-02</publish_date>
        <description>When Carla meets Paul at an ornithology 
        conference, tempers fly as feathers get ruffled.</description>
     </book>
     <book id="bk107">
        <author>Thurman, Paula</author>
        <title>Splish Splash</title>
        <genre>Romance</genre>
        <price>4.95</price>
        <publish_date>2000-11-02</publish_date>
        <description>A deep sea diver finds true love twenty 
        thousand leagues beneath the sea.</description>
     </book>
     <book id="bk108">
        <author>Knorr, Stefan</author>
        <title>Creepy Crawlies</title>
        <genre>Horror</genre>
        <price>4.95</price>
        <publish_date>2000-12-06</publish_date>
        <description>An anthology of horror stories about roaches,
        centipedes, scorpions  and other insects.</description>
     </book>
     <book id="bk109">
        <author>Kress, Peter</author>
        <title>Paradox Lost</title>
        <genre>Science Fiction</genre>
        <price>6.95</price>
        <publish_date>2000-11-02</publish_date>
        <description>After an inadvertant trip through a Heisenberg
        Uncertainty Device, James Salway discovers the problems 
        of being quantum.</description>
     </book>
     <book id="bk110">
        <author>O'Brien, Tim</author>
        <title>Microsoft .NET: The Programming Bible</title>
        <genre top="cali">Computer</genre>
        <price>36.95</price>
        <publish_date>2000-12-09</publish_date>
        <description>Microsoft's .NET initiative is explored in 
        detail in this deep programmer's reference.</description>
     </book>
     <book id="bk111">
        <author>O'Brien, Tim</author>
        <title>MSXML3: A Comprehensive Guide</title>
        <genre>Computer</genre>
        <price>36.95</price>
        <publish_date>2000-12-01</publish_date>
        <description>The Microsoft MSXML3 parser is covered in 
        detail, with attention to XML DOM interfaces, XSLT processing, 
        SAX and more.</description>
     </book>
     <book id="bk112">
        <author>Galos, Mike</author>
        <title>Visual Studio 7: A Comprehensive Guide</title>
        <genre>Computer</genre>
        <price>49.95</price>
        <publish_date cali="hola">2001-04-16</publish_date>
        <description>Microsoft Visual Studio 7 is explored in depth,
        looking at how Visual Basic, Visual C++, C#, and ASP+ are 
        integrated into a comprehensive development 
        environment.</description>
     </book>
  </catalog>`;
  consulta: string = '';
  salida: string = '';

  fname: string = '';
  simbolos: any = [];
  errores: any = [];

  newTab() {
    window.open("/tytusx-G23", "_blank");
  }

  closeTab() {
    window.close();
  }

  onSubmit() {
    var iconvlite = require('iconv-lite');
    let grammar_value = (<HTMLSelectElement>document.getElementById('grammar_selector')).value;
    if (this.entrada != "" && this.consulta != "") {
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

  getAST() {
    this.simbolos = [];
    this.errores = [];
    if (this.entrada != "") {
      const x = { "input": this.entrada }
      this.appService.getAST(x).subscribe(
        data => {
          saveAs(data, "AST");
          this.salida = "AST has been generated!";
          console.log('AST received!');
        },
        error => {
          console.log('There was an error :(', error);
          this.salida = "Ocurrió un error al analizar la entrada.\nNo se generó el AST."
        }
      );
    } else
      alert("Entrada vacía. No se puede generar el AST.");
  }

  getCST() {
    this.simbolos = [];
    this.errores = [];
    if (this.entrada != "") {
      const x = { "input": this.entrada }
      this.appService.getCST(x).subscribe(
        data => {
          saveAs(data, "CST");
          this.salida = "CST has been generated!";
          console.log('CST received!');
        },
        error => {
          console.log('There was an error :(', error);
          this.salida = "Ocurrió un error al analizar la entrada.\nNo se generó el CST."
        }
      );
    } else
      alert("Entrada vacía. No se puede generar el CST.");
  }

  getDAG() {
    this.simbolos = [];
    this.errores = [];
    if (this.entrada != "") {
      const x = { "input": this.entrada }
      this.appService.getDAG(x).subscribe(
        data => {
          saveAs(data, "DAG");
          this.salida = "DAG has been generated!";
          console.log('DAG received!');
        },
        error => {
          console.log('There was an error :(', error);
          this.salida = "Ocurrió un error al analizar la entrada.\nNo se generó el DAG."
        }
      );
    } else
      alert("Entrada vacía. No se puede generar el DAG.");
  }


  saveFile(id: number) {
    var f = document.createElement('a');
    let data = "";
    if (id === 1)
      data = this.entrada;
    else
      data = this.consulta;
    f.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    f.setAttribute('download', this.fname ? this.fname.replace("C:\\fakepath\\", "") : (id === 1 ? 'file.xml' : 'file.xpath'));
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
    else
      document.getElementById("fileInput2")!.click();
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
            break;
          case 2:
            this.consulta = String(text);
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
    }
    this.salida = "";
  }

}
