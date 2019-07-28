const SQLiteRepository = require("../lib/SQLiteRepository");
const User = require("../entity/db/User");
const constants = require("../constants");

class UserRepository extends SQLiteRepository {
    constructor() {
        super(User, constants.USER_TABLE);
    }

    async findByUsername(username) {
        const result = await this.find(
            `SELECT * FROM ${constants.USER_TABLE} WHERE username=?`,
            username
        );
        return result.map(this.mapItem.bind(this));
    }

    async findFirstByUsername(username) {
        const result = await this.findFirst(
            `SELECT * FROM ${constants.USER_TABLE} WHERE username=?`,
            username
        );
        return this.mapItem(result);
    }
}

module.exports = UserRepository;
