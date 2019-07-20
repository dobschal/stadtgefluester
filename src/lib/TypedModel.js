class TypedModel {
  constructor(sourceObject) {
    if (typeof sourceObject === "undefined") {
      sourceObject = this.defaultProps;
    }
    for (const key in this.props) {
      if (this.props.hasOwnProperty(key)) {
        const type = this.props[key];
        let value = sourceObject[key];
        if (typeof value === "undefined") {
          throw new Error(
            `Property ${key} is missing for typed model ${
              this.constructor.name
            }!`
          );
        }
        if (type instanceof TypedModel) {
          value = new type(value);
        }
        if (!TypedModel.hasType(type, value)) {
          throw new TypeError(
            `Property ${key} of model ${this.constructor.name} needs to be a ${
              TypedModel.defaultValue(type).constructor.name
            }, but got a ${value.constructor.name}!`
          );
        }
        this[key] = value;
      }
    }
    return new Proxy(this, {
      set(object, key, value) {
        const type = object.props[key];
        if (type instanceof TypedModel) {
          value = new type(value);
        }
        if (!TypedModel.hasType(type, value)) {
          throw new TypeError(
            `Property ${key} of model ${
              object.constructor.name
            } needs to be a ${
              TypedModel.defaultValue(type).constructor.name
            }, but got a ${value.constructor.name}!`
          );
        }
        object[key] = value;
        return true;
      },

      get(object, key) {
        if (typeof key === "symbol" || key === "inspect") {
          return undefined;
        }
        if (typeof object.props[key] === "undefined") {
          throw new ReferenceError(
            `Model ${object.constructor.name} has no property named ${key}.`
          );
        }
        if (typeof object[key] === "undefined") {
          return TypedModel.defaultValue(object.props[key]);
        }
        return object[key];
      }
    });
  }

  get props() {
    throw new Error(
      `${
        this.constructor.name
      } needs have a getter for props with type definitions! props`
    );
  }

  get defaultProps() {
    const defaultProps = {};
    for (const key in this.props) {
      if (this.props.hasOwnProperty(key)) {
        const type = this.props[key];
        defaultProps[key] = TypedModel.defaultValue(type);
      }
    }
    return defaultProps;
  }

  static defaultValue(type) {
    switch (type) {
      case String:
        return "";
      case "string":
        return "";
      case "String":
        return "";
      case Boolean:
        return false;
      case "boolean":
        return false;
      case "Boolean":
        return false;
      case Number:
        return 0;
      case "number":
        return 0;
      case "Number":
        return 0;
      case Object:
        return {};
      case "object":
        return {};
      case "Object":
        return {};
      default:
        return typeof type !== "string" ? new type() : undefined;
    }
  }

  static hasType(type, value) {
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
      default:
        return value instanceof type;
    }
  }
}

module.exports = TypedModel;
