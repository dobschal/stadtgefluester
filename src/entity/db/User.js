const Type = require("../../lib/Type");

class User extends Type {
    static get props() {
        return {
            id: Number,
            username: String,
            password: String,
            phoneNumber: String,
            phoneNumberConfirmed: Boolean,
            email: String,
            emailConfirmed: Boolean,
            lastLoginAt: Date,
            createdAt: Date,
            userRoles: Array
        };
    }
}

module.exports = User;
