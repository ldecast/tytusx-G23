
export class Atributo {
    private cst?: string;
    constructor(public id: string, public  value: string, public  line: string,  public column: string) {
    }

    set Cst(value){
        this.cst = value;
    }
    get Cst(){
        return this.cst;
    }
}