"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoding = void 0;
const Enum_1 = require("./Enum");
class Encoding {
    constructor(encoding) {
        this.codes = Enum_1.Codes;
        if (encoding === null)
            this.encoding = this.codes.INVALID;
        else {
            this.encoding = encoding;
            this.getCode();
        }
    }
    getCode() {
        try {
            let decl = String(this.encoding).replace(/\s/g, '').toLowerCase();
            let code = decl.substr(decl.indexOf("encoding") + 8);
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
                    break;
            }
        }
        catch (error) {
            this.encoding = this.codes.INVALID;
        }
    }
}
exports.Encoding = Encoding;
