
export class Atributo {

    id: string;
    value: string;
    line: string;
    column: string;

    constructor(id: string, value: string, line: string, column: string) {
        this.id = id;
        this.value = value;
        this.line = line;
        this.column = column;
    }

}