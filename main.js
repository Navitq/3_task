const crypto = require('crypto');
const readline = require('readline-sync');
const TableCli = require('cli-table');

class GameRulesLogic {
    constructor(args){
        this.valuesArr = args;
        this.halfCircleAm = (this.valuesArr.length-1) / 2;
    }

    checkGameState(player, comp){
        let indexPlayer =  this.valuesArr.indexOf(player);
        let indexComp = this.valuesArr.indexOf(comp);
        if(indexPlayer == indexComp){
            return "Draw";
        } else if(indexPlayer < indexComp && indexComp <= indexPlayer + this.halfCircleAm){
            return "Lose";
        } else if(indexPlayer > indexComp && indexPlayer <= indexComp + this.halfCircleAm) {
            return "Win";
        } else if(indexPlayer -  this.halfCircleAm < 0) {
            return "Win";
        } else {
            return "Lose";
        }
    }
}

class GenScrtKey {
    static createScrtKey(){
        return crypto.generateKeySync('hmac', { length: 256 }).export().toString('hex');
    }
}

class GenHMAC {
    createNewHMAC(scrKey, str){
        if(!scrKey || !str){
            throw(new Error("scrKey or str, or both are not defined!"));
        }
        this.scrKey = scrKey;
        this.keyHMAC =  crypto.createHmac('sha256', this.scrKey).update(str).digest('hex');
    }

    getScrtKey(){
        if(this.scrKey){
            return this.scrKey;
        }
        throw(new Error("this.scrKey is not defined!"));
    }

    getHMACKey(){
        if(this.keyHMAC){
            return this.keyHMAC;
        }
        throw(new Error("this.keyHMAC is not defined!"));
    }
}

class TableGen {
    constructor(args, logObj){
        this.args = args;
        this.logObj = logObj;
        this.tableObj = new TableCli({ head: ["v User\\PC >", ...this.args] });
        let arrayTable = [];
        for(let i = 0; i < this.args.length; ++i){
            let conLineObj = {};
            conLineObj[this.args[i]] = [];
            for(let n = 0;n < this.args.length; ++n){
                conLineObj[this.args[i]].push(logObj.checkGameState(this.args[i],this.args[n]));
            }
            arrayTable.push(conLineObj);
        }
        this.tableObj.push(...arrayTable);
    }

    showTable(){
        console.log("The table is viewed from the user's perspective", `\n${this.tableObj.toString()}`);
    }
}

function prsArgChecker(gameArgs){
    let setChecker = new Set();   
    for(let i = 0;i<gameArgs.length;++i) {
        setChecker.add(gameArgs[i]);
    }
    if(gameArgs.length < 3) {
        console.log('To start playing you must have at least 3 strings!\nExample one: node main.js paper rock spock\nExample two: node main.js tiger lion hamster dragon elephant');
        return false; 
    } else if (gameArgs.length % 2 == 0) {
        console.log('To start playing you must have odd number of lines!\nExample one: node main.js paper rock spock\nExample two: node main.js tiger lion hamster dragon elephant');
        return false; 
    } else if (setChecker.size < gameArgs.length){
        console.log('Each string value must be unique!\nExample one: node main.js paper rock spock\nExample two: node main.js tiger lion hamster dragon elephant');
        return false; 
    } else {
        return true;
    }
}

let objHMAC = new GenHMAC();

let gameArgs = process.argv.slice(2,process.argv.length);

let isCorrect = prsArgChecker(gameArgs);

if(!isCorrect){
    return;
}

let gameLogic = new GameRulesLogic(gameArgs);
let helpTableObj = new TableGen(gameArgs, gameLogic);

let availableValues = ["?", "0"];
let nameFixed = null;

for(let i = 0; i < gameArgs.length; ++i){
    availableValues.push(`${i+1}`);
}

exit: while(true){
    let cpChoiceStr = gameArgs[Math.trunc(Math.random()*gameArgs.length)];

    objHMAC.createNewHMAC(GenScrtKey.createScrtKey(), cpChoiceStr);

    console.log(`HMAC: ${objHMAC.getHMACKey()}`);

    while(true){
        console.log("Available moves:");
        for(let i = 0; i < gameArgs.length; ++i){
            console.log(`${i + 1} - ${gameArgs[i]}`);
        }
        console.log("0 - exit", "\n? - help");

        const name = readline.question('Enter your move: ');

        let filteredName = name.split(" ").filter(function(el) {
            return el != '';
        });

        if(filteredName.length>1){
            console.log('Incorrect number! You should select a number from the first column!  Example: 1');
            continue;
        }

        nameFixed = name.replace(/\s+/g, '');

        if(nameFixed == '?'){
            helpTableObj.showTable();
            continue;
        } else if(nameFixed == '0'){
            break exit;
        } else if (availableValues.includes(nameFixed)){
            break;
        } else {
            console.log('Incorrect number! You should select a number from the first column! Example: 1');
            continue;
        }
    }

    console.log(`Your move: ${gameArgs[Number(nameFixed)-1]}`,
                `\nComputer move: ${cpChoiceStr}`,
                `\nYou ${(gameLogic.checkGameState(gameArgs[Number(nameFixed)-1], cpChoiceStr)).toLowerCase()}!`,
                `\nHMAC key: ${objHMAC.getScrtKey()}\n`);
}














