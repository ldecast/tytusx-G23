import { Codes } from './Enum';

export class Encoding {

    encoding: any;
    codes = Codes;

    constructor(encoding: string) {
        this.encoding = encoding;
        this.getCode();
    }

    getCode() {
        let decl = String(this.encoding).replace(/\s/g, '').toLowerCase();
        let subs = decl.substr(decl.indexOf("encoding=") + 9);
        let code;
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
                this.encoding = this.codes.ISO8859_1
                break;
            case "ascii":
                this.encoding = this.codes.ASCII;
                break;
            default:
                this.encoding = this.codes.INVALID;
        }
    }

}