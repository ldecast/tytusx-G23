"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoding = void 0;
var Enum_1 = require("./Enum");
var Encoding = /** @class */ (function () {
    function Encoding(encoding) {
        this.codes = Enum_1.Codes;
        this.encoding = encoding;
        this.getCode();
    }
    Encoding.prototype.getCode = function () {
        var decl = String(this.encoding).replace(/\s/g, '').toLowerCase();
        var subs = decl.substr(decl.indexOf("encoding=") + 9);
        var code;
        if (subs[0] === "\"") {
            code = subs.substr(1, subs.indexOf("\"", 1) - 1);
        }
        else if (subs[0] === "\'") {
            code = subs.substr(1, subs.indexOf("\'", 1) - 1);
        }
        switch (code) {
            case "utf-8":
                this.encoding = this.codes.UTF8;
                break;
            case "iso-8859-1":
                this.encoding = this.codes.ISO8859_1;
                break;
            case "ascii":
                this.encoding = this.codes.ASCII;
                break;
            default:
                this.encoding = this.codes.INVALID;
        }
    };
    return Encoding;
}());
exports.Encoding = Encoding;
