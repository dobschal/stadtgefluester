const path = require("path");

module.exports = Object.freeze({
    USER_TABLE: "user",
    DATABASE_PATH: path.join(__dirname, "../.db/database.db"),
    NUMBER_PRECISION: 100000000,
    USER_ROLE_ADMIN: "admin",
    USER_ROLE_USER: "user",
    TOKEN_EXPIRATION: 1000 * 60 * 15 // 15 min...
});
