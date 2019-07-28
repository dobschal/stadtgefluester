class Type {
    /**
     * @param {object} sourceObject - Object to use for copy constructor
     */
    constructor(sourceObject) {
        if (typeof sourceObject === "undefined") sourceObject = {};
        Type.match(Object, sourceObject);
        let values = {};
        let props = this.props || this.constructor.props;
        let required = this.required || this.constructor.required;
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                const type = props[key];
                const isRequired = required.includes(key);
                let value = sourceObject[key];
                if (
                    isRequired &&
                    (typeof value === "undefined" || value === null)
                ) {
                    throw new TypeError(`Missing required key ${key}!`);
                } else if (typeof value === "undefined") {
                    value = Type.defaultValue(type);
                }

                Object.defineProperty(this, key, {
                    get() {
                        return values[key];
                    },
                    set(value) {
                        if (
                            isRequired &&
                            (typeof value === "undefined" || value === null)
                        ) {
                            throw new TypeError(`Missing required key ${key}!`);
                        } else if (
                            typeof value !== "undefined" &&
                            value !== null
                        ) {
                            Type.match(type, value);
                        }
                        values[key] = value;
                    },
                    enumerable: true
                });

                this[key] = value;
            }
        }
    }

    toJSON() {
        const jsonObject = {};
        Object.keys(this).forEach(key => {
            jsonObject[key] = this[key];
        });
        return jsonObject;
    }

    /**
     *  @returns {[string]: any} - dictionary that describes the properties types
     */
    static get props() {
        return {
            id: Number
        };
    }

    /**
     * @returns {array<string>} - keys of required properties
     */
    static get required() {
        return [];
    }

    /**
     * @param {any} type - type to get the default value from
     */
    static defaultValue(type) {
        switch (type) {
            case String:
                return "";
            case "string":
                return "";
            case "String":
                return "";
            case Object:
                return {};
            case "object":
                return {};
            case "Object":
                return {};
            case Array:
                return [];
            case "array":
                return [];
            default:
                return null;
        }
    }

    /**
     * May throw an error if value not matches type!
     * @param {any} type - Type the value should have
     * @param {any} value - Value to check
     */
    static match(type, value) {
        if (!Type.is(type, value)) {
            const printableType = typeof type === "string" ? type : type.name;
            throw new TypeError(
                `Value ${value} has wrong type ${typeof value} instead of ${printableType}!`
            );
        }
    }

    /**
     * @param {any} type - Type the value should have
     * @param {any} value - Value to check
     * @returns {boolean}
     */
    static is(type, value) {
        switch (type) {
            case String:
                return typeof value === "string";
            case "string":
                return typeof value === "string";
            case "String":
                return typeof value === "string";
            case Boolean:
                return typeof value === "boolean";
            case "boolean":
                return typeof value === "boolean";
            case "Boolean":
                return typeof value === "boolean";
            case Number:
                return typeof value === "number";
            case "number":
                return typeof value === "number";
            case "Number":
                return typeof value === "number";
            case Object:
                return typeof value === "object";
            case "object":
                return typeof value === "object";
            case "Object":
                return typeof value === "object";
            case Array:
                return Array.isArray(value);
            case "array":
                return Array.isArray(value);
            default:
                return value instanceof type;
        }
    }
}
module.exports = Type;
