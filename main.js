const readline = require('readline-sync');
const GameRulesLogic = require('./GameRulesLogic')
const GenScrtKey = require('./GenScrtKey')
const GenHMAC = require('./GenHMAC')
const TableGen = require('./TableGen')



function arrToSet(gameArgs){
    let setChecker = new Set();   
    for(let i = 0;i<gameArgs.length;++i) {
        setChecker.add(gameArgs[i]);
    }
    return setChecker;
}

function processArgChecker(gameArgs){
    let setChecker = arrToSet(gameArgs)   
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

let isCorrect = processArgChecker(gameArgs);

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














