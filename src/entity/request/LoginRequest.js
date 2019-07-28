const Type = require("../../lib/Type");

class LoginRequest extends Type {
    get props() {
        return {
            username: String,
            password: String
        };
    }

    get required() {
        return ["username", "password"];
    }
}

module.exports = LoginRequest;
