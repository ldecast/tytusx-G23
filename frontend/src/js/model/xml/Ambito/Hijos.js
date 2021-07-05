"use strict";
const Ambito_1 = require("./Ambito");
function exec(_expresiones, _ambito) {
    _expresiones.forEach(element => {
        if (element) {
            if (element.childs) {
                let nuevoAmbito = new Ambito_1.Ambito(_ambito, "hijo");
                exec(element.childs, nuevoAmbito);
            }
            _ambito.addSimbolo(element);
        }
    });
}
module.exports = { exec: exec };
