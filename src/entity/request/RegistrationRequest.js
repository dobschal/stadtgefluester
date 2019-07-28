const Type = require("../../lib/Type");

class RegistrationRequest extends Type {
    get props() {
        return {
            username: String,
            password: String,
            phoneNumber: String,
            email: String
        };
    }

    get required() {
        return ["username", "password", "email", "phoneNumber"];
    }
}

module.exports = RegistrationRequest;
