const crypto = require('crypto');

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

module.exports = GenHMAC;