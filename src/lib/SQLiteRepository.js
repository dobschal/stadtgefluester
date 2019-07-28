const SQLite = require("sqlite3").verbose();
const Type = require("../lib/Type");
const constants = require("../constants");

class SQLiteRepository {
    constructor(type, name) {
        if (!Type.is(String, name)) {
            name = type.name;
        }
        this.type = type;
        this.name = name.toLowerCase();
        this.props = type.props || type.prototype.props;
        this._init();
    }

    get columns() {
        let result = "";
        for (const key in this.props) {
            if (this.props.hasOwnProperty(key)) {
                const type = this.props[key];

                // Skip column id...
                if (key === "id") {
                    if (type !== Number && type !== "number") {
                        throw new TypeError(
                            "IDs for database entities can only have numeric autoincrement ids! Change property to 'id: Number' in TypedModel."
                        );
                    }
                    continue;
                }

                switch (type) {
                    case String:
                        result += ", " + key + " TEXT";
                        break;
                    case "string":
                        result += ", " + key + " TEXT";
                        break;
                    case "boolean":
                        result += ", " + key + " INTEGER";
                        break;
                    case Boolean:
                        result += ", " + key + " INTEGER";
                        break;
                    case "number":
                        result += ", " + key + " INTEGER";
                        break;
                    case Number:
                        result += ", " + key + " INTEGER";
                        break;
                    case Date:
                        result += ", " + key + " INTEGER";
                        break;
                    case "date":
                        result += ", " + key + " INTEGER";
                        break;
                    case "array":
                        result += ", " + key + " TEXT";
                        break;
                    case Array:
                        result += ", " + key + " TEXT";
                        break;
                    default:
                        throw new Error(
                            "SQLiteRepository cannot handle type " + type
                        );
                }
            }
        }
        return result;
    }

    async _init() {
        console.log(`Inititilise database table ${this.name}.`);
        await this.run(
            `CREATE TABLE IF NOT EXISTS ${
                this.name
            } (id INTEGER PRIMARY KEY AUTOINCREMENT ${this.columns});`
        );
    }

    run(sql, params) {
        return new Promise(resolve => {
            Type.match(String, sql);
            const db = new SQLite.Database(constants.DATABASE_PATH);
            db.run(sql, params || [], function(error) {
                if (error) throw error;
                resolve(this);
            });
        });
    }

    find(sql, params) {
        return new Promise(resolve => {
            Type.match(String, sql);
            const db = new SQLite.Database(constants.DATABASE_PATH);
            db.all(sql, params || [], function(error, rows) {
                if (error) throw error;
                resolve(rows);
            });
        });
    }

    findFirst(sql, params) {
        return new Promise(resolve => {
            Type.match(String, sql);
            const db = new SQLite.Database(constants.DATABASE_PATH);
            db.get(sql, params || [], function(error, row) {
                if (error) throw error;
                resolve(row);
            });
        });
    }

    async save(objectToSave) {
        Type.match(Type, objectToSave);
        const isNew = objectToSave.id === null;
        if (isNew) {
            const columns = Object.keys(this.props)
                .filter(key => key !== "id")
                .join(",");
            const questionMarks = Object.keys(this.props)
                .filter(key => key !== "id")
                .map(() => "?")
                .join(",");
            const values = Object.keys(this.props)
                .filter(key => key !== "id")
                .map(this.mapItemForDb.bind({ objectToSave }));
            const { lastID } = await this.run(
                `INSERT INTO ${
                    this.name
                } (${columns}) VALUES (${questionMarks})`,
                values
            );
            objectToSave.id = lastID;
        } else {
            const columns = Object.keys(this.props)
                .filter(key => key !== "id")
                .map(key => key + " = ?")
                .join(",");
            const values = Object.keys(this.props)
                .filter(key => key !== "id")
                .map(this.mapItemForDb.bind({ objectToSave }));
            values.push(objectToSave.id);
            await this.run(
                `UPDATE ${this.name} SET ${columns} WHERE id=?`,
                values
            );
        }
        return objectToSave;
    }

    mapItemForDb(key) {
        const item = this.objectToSave[key];
        if (item instanceof Date) return item.getTime();
        if (typeof item === "number" || item instanceof Number)
            return Math.round(item * constants.NUMBER_PRECISION);
        if (typeof item === "boolean" || item instanceof Boolean)
            return item ? 1 : 0;
        if (Array.isArray(item)) return item.join(",");
        return item;
    }

    mapItem(item) {
        if (item === null || typeof item === "undefined") {
            return null;
        }
        for (const key in item) {
            if (key === "id") continue;
            if (item.hasOwnProperty(key)) {
                const value = item[key];
                if (value === null) continue;
                if (this.props[key] === Date) {
                    item[key] = new Date(value);
                }
                if (
                    this.props[key] === Number ||
                    this.props[key] === "number"
                ) {
                    item[key] = value / constants.NUMBER_PRECISION;
                }
                if (
                    this.props[key] === Boolean ||
                    this.props[key] === "boolean"
                ) {
                    item[key] = value ? true : false;
                }
                if (this.props[key] === Array || this.props[key] === "array") {
                    item[key] = value.split(",");
                }
            }
        }
        return new this.type(item);
    }

    async findAll() {
        const items = await this.find(`SELECT * FROM ${this.name}`);
        return items.map(this.mapItem.bind(this));
    }

    async findById(id) {
        const result = await this.findFirst(
            `SELECT * FROM ${this.name} WHERE id=?`,
            [id]
        );
        return this.mapItem(result);
    }
}

module.exports = SQLiteRepository;
