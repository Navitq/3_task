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

module.exports = GameRulesLogic;