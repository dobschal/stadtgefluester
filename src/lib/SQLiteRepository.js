const SQLite = require("sqlite3").verbose();
const path = require("path");

class SQLiteRepository {
    constructor() {
        this.connected = false;
        this.connection = new SQLite.Database(
            path.join(__dirname, "../../db/database.db"),
            SQLite.OPEN_CREATE,
            error => {
                if (error) throw error;
                this.connected = true;
            }
        );
    }
}

module.exports = SQLiteRepository;
