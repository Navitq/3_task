const crypto = require('crypto');

class GenScrtKey {
    static createScrtKey(){
        return crypto.generateKeySync('hmac', { length: 256 }).export().toString('hex');
    }
}

module.exports = GenScrtKey;