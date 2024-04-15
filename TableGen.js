const TableCli = require('cli-table');

class TableGen {
    constructor(args, logObj){
        this.args = args;
        this.logObj = logObj;
        this.tableObj = new TableCli({ head: ["v User\\PC >", ...this.args] });
        this.createTable();
    }

    createTable(){
        let arrayTable = [];
        for(let i = 0; i < this.args.length; ++i){
            let conLineObj = {};
            conLineObj[this.args[i]] = [];
            for(let n = 0;n < this.args.length; ++n){
                conLineObj[this.args[i]].push(this.logObj.checkGameState(this.args[i],this.args[n]));
            }
            arrayTable.push(conLineObj);
        }
        this.tableObj.push(...arrayTable);
    }

    showTable(){
        console.log("The table is viewed from the user's perspective", `\n${this.tableObj.toString()}`);
    }
}

module.exports = TableGen;