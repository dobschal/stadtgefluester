const Type = require("../../lib/Type");

class TokenPayload extends Type {
    static get props() {
        return {
            uid: Number, // User ID
            exp: Number, // Expiration Timestamp in Milliseconds
            did: String, // Device ID
            roles: Array
        };
    }
}

module.exports = TokenPayload;
