//-----------------------2023-05-16 MD------------------------------------------------

//Variante Delegieren statt Vererben: Wrapping/Komposition
import {KFZ_2} from './class.KFZ.js';

export class PKW_2 {
    constructor(selectedData = 1) {
        console.log("******** Wrapping/Komposition KFZ 2***********");
        this.Auto = new KFZ_2(selectedData);
        this.Auto.Modell = selectedData.modell;
        return this.Auto;
    }
}

//====================================================================================
//====================================================================================
//Variante extends ( Vererben ), KFZ im Import dann ohne {}, in der Importdatei muss "default" beim Export angegeben werden
import KFZ from './class.KFZ.js';

export class PKW extends KFZ {
    constructor(selectedData = selectedData || 1) {
        const Auto = super(selectedData);
        console.log("******* extends KFZ************");
        Auto.Modell = selectedData.modell;
    }
}

//****************************************
function A() {
    return 1;
}

export {A}
