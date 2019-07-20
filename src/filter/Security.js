class Security {
  static get userRoles() {
    return ["user", "admin"];
  }
  static secure(userRole) {
    if (!Security.userRoles.includes(userRole)) {
      throw new Error("Unknown user role " + userRole + "!");
    }
    return (req, res, next) => {
      next();
    };
  }
}

module.exports = Security;
